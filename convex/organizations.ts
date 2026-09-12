import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { mutation, MutationCtx, query } from './_generated/server';

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

    const organization = await ctx.db.get(args.orgId);

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
          isOwner: organization?.ownerId === member.userId,
          isSelf: member.userId === userId,
          viewerIsAdmin: membership.role === 'admin',
        };
      })
    );
  },
});

const adminMembership = async (
  ctx: MutationCtx,
  orgId: Id<'organizations'>
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const membership = await ctx.db
    .query('memberships')
    .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('orgId', orgId))
    .unique();

  if (!membership || membership.role !== 'admin') {
    throw new Error('Not authorized');
  }

  return { userId, membership };
};

const memberOf = async (
  ctx: MutationCtx,
  orgId: Id<'organizations'>,
  userId: Id<'users'>
) => {
  const membership = await ctx.db
    .query('memberships')
    .withIndex('by_user_org', (q) => q.eq('userId', userId).eq('orgId', orgId))
    .unique();

  if (!membership) {
    throw new Error('That person is not in this organization');
  }

  return membership;
};

export const setMemberRole = mutation({
  args: {
    orgId: v.id('organizations'),
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('member')),
  },
  handler: async (ctx, args) => {
    await adminMembership(ctx, args.orgId);

    const organization = await ctx.db.get(args.orgId);

    if (organization?.ownerId === args.userId) {
      throw new Error('The owner is always an admin');
    }

    const target = await memberOf(ctx, args.orgId, args.userId);

    if (target.role === args.role) {
      return;
    }

    /* An organization nobody can administer is a dead end. */
    if (target.role === 'admin') {
      const admins = await ctx.db
        .query('memberships')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
        .collect();

      if (admins.filter((row) => row.role === 'admin').length <= 1) {
        throw new Error('Leave at least one admin');
      }
    }

    await ctx.db.patch(target._id, { role: args.role });
  },
});

export const removeMember = mutation({
  args: {
    orgId: v.id('organizations'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { userId } = await adminMembership(ctx, args.orgId);

    if (args.userId === userId) {
      throw new Error('You cannot remove yourself');
    }

    const organization = await ctx.db.get(args.orgId);

    if (organization?.ownerId === args.userId) {
      throw new Error('The owner cannot be removed');
    }

    const target = await memberOf(ctx, args.orgId, args.userId);

    /* Their boards stay with the organization; what leaves with them is the
       membership and the favourites that only make sense inside it. */
    const favorites = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', args.userId).eq('orgId', args.orgId)
      )
      .collect();

    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }

    await ctx.db.delete(target._id);
  },
});

export const rename = mutation({
  args: {
    orgId: v.id('organizations'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await adminMembership(ctx, args.orgId);

    const name = args.name.trim();

    if (!name) {
      throw new Error('A name is required');
    }

    if (name.length > 60) {
      throw new Error('That name is too long');
    }

    /* The slug is left alone on purpose: it is an identifier that other
       things may already point at, not a display name. */
    await ctx.db.patch(args.orgId, { name });
  },
});

export const remove = mutation({
  args: {
    orgId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const organization = await ctx.db.get(args.orgId);
    if (!organization) {
      throw new Error('Organization not found');
    }

    if (organization.ownerId !== userId) {
      throw new Error('Only the owner can delete an organization');
    }

    /* Everything hanging off the organization goes with it, or the tables
       fill up with rows pointing at something that no longer exists. */
    const boards = await ctx.db
      .query('boards')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect();

    for (const board of boards) {
      const favorites = await ctx.db
        .query('userFavorites')
        .withIndex('by_board', (q) => q.eq('boardId', board._id))
        .collect();

      for (const favorite of favorites) {
        await ctx.db.delete(favorite._id);
      }

      await ctx.db.delete(board._id);
    }

    const memberships = await ctx.db
      .query('memberships')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect();

    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect();

    for (const invitation of invitations) {
      await ctx.db.delete(invitation._id);
    }

    await ctx.db.delete(args.orgId);
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

    const alreadyInvited = await ctx.db
      .query('invitations')
      .withIndex('by_email', (q) => q.eq('email', email))
      .collect();

    if (alreadyInvited.some((row) => row.orgId === args.orgId)) {
      throw new Error('That address has already been invited');
    }

    const invitee = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .unique();

    if (invitee) {
      const existing = await ctx.db
        .query('memberships')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', invitee._id).eq('orgId', args.orgId)
        )
        .unique();

      if (existing) {
        throw new Error('That person is already in this organization');
      }
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

const liveInvitation = (invitation: { expiresAt?: number }) =>
  invitation.expiresAt === undefined || invitation.expiresAt > Date.now();

/* Who has been asked to join and has not joined yet. Everyone in the
   organization can see it, the same as they can see the member list. */
export const pendingInvitations = query({
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

    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
      .collect();

    return await Promise.all(
      invitations.filter(liveInvitation).map(async (invitation) => {
        const inviter = await ctx.db.get(invitation.invitedBy);

        return {
          _id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          invitedAt: invitation._creationTime,
          expiresAt: invitation.expiresAt,
          invitedBy: inviter?.name ?? inviter?.email ?? 'Someone',
          canRevoke: membership.role === 'admin',
        };
      })
    );
  },
});

/* Every invitation waiting for the signed in person, whatever organization it
   came from. Matched on the address it was sent to. */
export const myInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    const email = user?.email?.trim().toLowerCase();

    if (!email) {
      return [];
    }

    const invitations = await ctx.db
      .query('invitations')
      .withIndex('by_email', (q) => q.eq('email', email))
      .collect();

    const live = invitations.filter(liveInvitation);

    const resolved = await Promise.all(
      live.map(async (invitation) => {
        const [organization, inviter, existing] = await Promise.all([
          ctx.db.get(invitation.orgId),
          ctx.db.get(invitation.invitedBy),
          ctx.db
            .query('memberships')
            .withIndex('by_user_org', (q) =>
              q.eq('userId', userId).eq('orgId', invitation.orgId)
            )
            .unique(),
        ]);

        if (!organization || existing) {
          return null;
        }

        return {
          _id: invitation._id,
          orgId: invitation.orgId,
          organization: organization.name,
          role: invitation.role,
          invitedAt: invitation._creationTime,
          invitedBy: inviter?.name ?? inviter?.email ?? 'Someone',
          /* An unverified address proves nothing, so the invitation is shown
             but cannot be taken until the address is confirmed. */
          canAccept: !!user?.emailVerificationTime,
        };
      })
    );

    return resolved.filter(
      (row): row is NonNullable<typeof row> => row !== null
    );
  },
});

const claimInvitation = async (
  ctx: MutationCtx,
  invitationId: Id<'invitations'>
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Not authenticated');
  }

  const invitation = await ctx.db.get(invitationId);
  if (!invitation) {
    throw new Error('Invitation not found');
  }

  const user = await ctx.db.get(userId);
  const email = user?.email?.trim().toLowerCase();

  if (!email || email !== invitation.email) {
    throw new Error('Invitation was sent to a different email');
  }

  return { userId, invitation, verified: !!user?.emailVerificationTime };
};

export const acceptMyInvitation = mutation({
  args: {
    invitationId: v.id('invitations'),
  },
  handler: async (ctx, args) => {
    const { userId, invitation, verified } = await claimInvitation(
      ctx,
      args.invitationId
    );

    if (!liveInvitation(invitation)) {
      throw new Error('Invitation expired');
    }

    if (!verified) {
      throw new Error('Confirm your email address before joining');
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

export const declineMyInvitation = mutation({
  args: {
    invitationId: v.id('invitations'),
  },
  handler: async (ctx, args) => {
    const { invitation } = await claimInvitation(ctx, args.invitationId);

    await ctx.db.delete(invitation._id);
  },
});

export const revokeInvitation = mutation({
  args: {
    invitationId: v.id('invitations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', invitation.orgId)
      )
      .unique();

    if (!membership || membership.role !== 'admin') {
      throw new Error('Not authorized');
    }

    await ctx.db.delete(args.invitationId);
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
