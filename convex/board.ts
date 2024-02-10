import { v } from 'convex/values';

import { mutation } from './_generated/server';

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
