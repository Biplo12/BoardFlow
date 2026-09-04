import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const slugify = (name: string, seed: string) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${base || 'org'}-${seed.slice(-6)}`;
};

const TOKEN_BYTES = 32;

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const randomToken = () => {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const organizations = await Promise.all(
      memberships.map((membership) => ctx.db.get(membership.orgId))
    );

    return organizations.filter(
      (organization): organization is NonNullable<typeof organization> =>
        organization !== null
    );
  },
});

export const get = query({
  args: {
    id: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', args.id)
      )
      .unique();

    if (!membership) {
      throw new Error('Not a member of this organization');
    }

    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const name = args.name.trim();
    if (!name) {
      throw new Error('Name is required');
    }

    const orgId = await ctx.db.insert('organizations', {
      name,
      slug: slugify(name, userId),
      ownerId: userId,
    });

    await ctx.db.insert('memberships', {
      orgId,
      userId,
      role: 'admin',
    });

    return orgId;
  },
});

export const members = query({
  args: {
    orgId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', args.orgId)
      )
      .unique();

    if (!membership) {
      throw new Error('Not a member of this organization');
    }

    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect();

    return await Promise.all(
      memberships.map(async (member) => {
        const user = await ctx.db.get(member.userId);

        return {
          _id: member._id,
          userId: member.userId,
          role: member.role,
          name: user?.name ?? user?.email ?? 'Teammate',
          email: user?.email,
          image: user?.image,
        };
      })
    );
  },
});

export const invite = mutation({
  args: {
    orgId: v.id('organizations'),
    email: v.string(),
    role: v.optional(v.union(v.literal('admin'), v.literal('member'))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', args.orgId)
      )
      .unique();

    if (!membership || membership.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const email = args.email.trim().toLowerCase();
    if (!email) {
      throw new Error('Email is required');
    }

    const token = randomToken();

    await ctx.db.insert('invitations', {
      orgId: args.orgId,
      email,
      role: args.role ?? 'member',
      invitedBy: userId,
      token,
      expiresAt: Date.now() + INVITATION_TTL_MS,
    });

    return token;
  },
});

export const acceptInvitation = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const invitation = await ctx.db
      .query('invitations')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (
      invitation.expiresAt !== undefined &&
      invitation.expiresAt < Date.now()
    ) {
      throw new Error('Invitation expired');
    }

    const user = await ctx.db.get(userId);
    const email = user?.email?.trim().toLowerCase();

    // An unverified address proves nothing, so anyone could claim an
    // invitation by signing up with the invited email.
    if (!email || !user?.emailVerificationTime) {
      throw new Error('Verified email required to accept an invitation');
    }

    if (email !== invitation.email) {
      throw new Error('Invitation was sent to a different email');
    }

    const existing = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', invitation.orgId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert('memberships', {
        orgId: invitation.orgId,
        userId,
        role: invitation.role,
      });
    }

    await ctx.db.delete(invitation._id);

    return invitation.orgId;
  },
});
