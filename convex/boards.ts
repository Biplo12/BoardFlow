import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { getAll } from 'convex-helpers/server/relationships';

import { query } from '@/convex/_generated/server';

export const get = query({
  args: {
    orgId: v.id('organizations'),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
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

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', userId).eq('orgId', args.orgId)
        )
        .order('desc')
        .collect();

      const ids = favoritedBoards.map((b) => b.boardId);

      /* A favorite can outlive the board it points at, and one stale row must
         not take the whole list down with it. */
      const boards = await getAll(ctx.db, ids);

      return boards.filter(Boolean).map((board) => ({
        ...board!,
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
          q.eq('userId', userId).eq('boardId', board._id)
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
