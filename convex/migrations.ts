import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';

const CLERK_API = 'https://api.clerk.com/v1';

interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  primary_email_address_id: string | null;
  email_addresses: {
    id: string;
    email_address: string;
    verification: { status: string } | null;
  }[];
}

interface ClerkOrganization {
  id: string;
  name: string;
  slug: string | null;
  image_url: string | null;
  created_by: string | null;
}

interface ClerkMembership {
  role: string;
  public_user_data: { user_id: string } | null;
}

const clerkFetch = async (path: string) => {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    throw new Error('CLERK_SECRET_KEY is not set');
  }

  const response = await fetch(`${CLERK_API}${path}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!response.ok) {
    throw new Error(`Clerk request failed: ${path} ${response.status}`);
  }

  return response.json();
};

const normalizeRole = (role: string): 'admin' | 'member' =>
  role.includes('admin') ? 'admin' : 'member';

export const upsertUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    // Convex Auth only links a sign-in to an existing user when the row has a
    // verified email, so without this the imported accounts stay orphaned.
    const emailVerificationTime =
      args.email && args.emailVerified ? Date.now() : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        image: args.image,
        emailVerificationTime,
      });

      return existing._id;
    }

    return await ctx.db.insert('users', {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
      emailVerificationTime,
    });
  },
});

export const upsertOrganization = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    ownerClerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const owner = args.ownerClerkId
      ? await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.ownerClerkId!))
          .unique()
      : null;

    if (!owner) {
      throw new Error(`Owner not found for organization ${args.clerkId}`);
    }

    const existing = await ctx.db
      .query('organizations')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        slug: args.slug,
        imageUrl: args.imageUrl,
        ownerId: owner._id,
      });

      return existing._id;
    }

    return await ctx.db.insert('organizations', {
      clerkId: args.clerkId,
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      ownerId: owner._id,
    });
  },
});

export const upsertMembership = internalMutation({
  args: {
    orgClerkId: v.string(),
    userClerkId: v.string(),
    role: v.union(v.literal('admin'), v.literal('member')),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.orgClerkId))
      .unique();

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userClerkId))
      .unique();

    if (!org || !user) {
      return;
    }

    const existing = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', user._id).eq('orgId', org._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
      return;
    }

    await ctx.db.insert('memberships', {
      orgId: org._id,
      userId: user._id,
      role: args.role,
    });
  },
});

export const importFromClerk = internalAction({
  args: {},
  handler: async (ctx) => {
    let userCount = 0;
    let offset = 0;

    while (true) {
      const users: ClerkUser[] = await clerkFetch(
        `/users?limit=100&offset=${offset}`
      );

      if (!users.length) break;

      for (const user of users) {
        const primaryAddress = user.email_addresses.find(
          (address) => address.id === user.primary_email_address_id
        );

        const name = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(' ');

        await ctx.runMutation(internal.migrations.upsertUser, {
          clerkId: user.id,
          name: name || undefined,
          email: primaryAddress?.email_address || undefined,
          image: user.image_url || undefined,
          emailVerified: primaryAddress?.verification?.status === 'verified',
        });

        userCount += 1;
      }

      offset += users.length;
    }

    let orgCount = 0;
    let membershipCount = 0;
    offset = 0;

    while (true) {
      const page = await clerkFetch(
        `/organizations?limit=100&offset=${offset}`
      );
      const organizations: ClerkOrganization[] = page.data ?? [];

      if (!organizations.length) break;

      for (const org of organizations) {
        await ctx.runMutation(internal.migrations.upsertOrganization, {
          clerkId: org.id,
          name: org.name,
          slug: org.slug ?? org.id,
          imageUrl: org.image_url || undefined,
          ownerClerkId: org.created_by || undefined,
        });

        orgCount += 1;

        const membershipsPage = await clerkFetch(
          `/organizations/${org.id}/memberships?limit=100`
        );
        const memberships: ClerkMembership[] = membershipsPage.data ?? [];

        for (const membership of memberships) {
          const userClerkId = membership.public_user_data?.user_id;
          if (!userClerkId) continue;

          await ctx.runMutation(internal.migrations.upsertMembership, {
            orgClerkId: org.id,
            userClerkId,
            role: normalizeRole(membership.role),
          });

          membershipCount += 1;
        }
      }

      offset += organizations.length;
    }

    return { userCount, orgCount, membershipCount };
  },
});

// Rewrites boards/userFavorites that still hold Clerk string ids to the new
// Convex ids, looked up by clerkId. Run after importFromClerk while the schema
// has `schemaValidation: false`, then re-enable validation and push again.
export const remapBoards = internalMutation({
  args: {},
  handler: async (ctx) => {
    let boardCount = 0;
    let favoriteCount = 0;

    const boards = await ctx.db.query('boards').collect();

    for (const board of boards) {
      const org = await ctx.db
        .query('organizations')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', board.orgId))
        .unique();

      const author = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', board.authorId))
        .unique();

      if (org || author) {
        await ctx.db.patch(board._id, {
          ...(org ? { orgId: org._id } : {}),
          ...(author ? { authorId: author._id } : {}),
        });
        boardCount += 1;
      }
    }

    const favorites = await ctx.db.query('userFavorites').collect();

    for (const favorite of favorites) {
      const org = await ctx.db
        .query('organizations')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', favorite.orgId))
        .unique();

      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', favorite.userId))
        .unique();

      if (org || user) {
        await ctx.db.patch(favorite._id, {
          ...(org ? { orgId: org._id } : {}),
          ...(user ? { userId: user._id } : {}),
        });
        favoriteCount += 1;
      }
    }

    return { boardCount, favoriteCount };
  },
});
