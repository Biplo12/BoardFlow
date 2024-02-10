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
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert('boards', {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== identity.subject) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error('Board not found');
    }

    if (board.authorId !== identity.subject) {
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
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', identity.subject).eq('boardId', board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error('Board already favorited');
    }

    await ctx.db.insert('userFavorites', {
      orgId: args.orgId,
      userId: identity.subject,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', identity.subject).eq('boardId', board._id)
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
    const board = await ctx.db.get(args.id);

    return board;
  },
});
