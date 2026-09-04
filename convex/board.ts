import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const MAX_TITLE_LENGTH = 60;

const images = [
  '/images/board/placeholders/1.svg',
  '/images/board/placeholders/2.svg',
  '/images/board/placeholders/3.svg',
  '/images/board/placeholders/4.svg',
  '/images/board/placeholders/5.svg',
  '/images/board/placeholders/6.svg',
  '/images/board/placeholders/7.svg',
  '/images/board/placeholders/8.svg',
  '/images/board/placeholders/9.svg',
  '/images/board/placeholders/10.svg',
];

export const create = mutation({
  args: {
    orgId: v.id('organizations'),
    title: v.string(),
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

    const user = await ctx.db.get(userId);

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert('boards', {
      title: args.title,
      orgId: args.orgId,
      authorId: userId,
      authorName: user?.name ?? user?.email ?? 'Anonymous',
      imageUrl: randomImage,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== userId) {
      throw new Error('Not authorized');
    }

    await ctx.db.delete(args.id);
  },
});

export const rename = mutation({
  args: {
    id: v.id('boards'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== userId) {
      throw new Error('Not authorized');
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error('Title is required');
    }

    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error('Title cannot be longer than 60 characters');
    }

    await ctx.db.patch(args.id, { title: args.title });
  },
});

export const favorite = mutation({
  args: {
    id: v.id('boards'),
    orgId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    if (board.orgId !== args.orgId) {
      throw new Error('Not authorized');
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', board.orgId)
      )
      .unique();

    if (!membership) {
      throw new Error('Not a member of this organization');
    }

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error('Board already favorited');
    }

    await ctx.db.insert('userFavorites', {
      orgId: args.orgId,
      userId,
      boardId: board._id,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error('Board not favorited');
    }

    await ctx.db.delete(existingFavorite._id);
  },
});

export const get = query({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      return null;
    }

    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_user_org', (q) =>
        q.eq('userId', userId).eq('orgId', board.orgId)
      )
      .unique();

    if (!membership) {
      throw new Error('Not a member of this organization');
    }

    return board;
  },
});
