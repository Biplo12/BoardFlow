import { v } from 'convex/values';
import { getAllOrThrow } from 'convex-helpers/server/relationships';

import { query } from '@/convex/_generated/server';

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', identity.subject).eq('orgId', args.orgId)
        )
        .order('desc')
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }

    const search = args.search?.toLowerCase();

    let boards = [];

    if (search) {
      boards = await ctx.db
        .query('boards')
        .withSearchIndex('search_title', (q) =>
          q.search('title', search).eq('orgId', args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query('boards')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
        .order('desc')
        .collect();
    }

    const boardsWithFavoriteRelation = boards.map(async (board) => {
      const favorite = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_board', (q) =>
          q.eq('userId', identity.subject).eq('boardId', board._id)
        )
        .unique();

      return {
        ...board,
        isFavorite: !!favorite,
      };
    });

    const resolvedBoards = await Promise.all(boardsWithFavoriteRelation);

    return resolvedBoards;
  },
});
