import { v } from 'convex/values';

import { internalAction } from './_generated/server';

const API = 'https://api.liveblocks.io/v2/rooms';

/* Board contents live with Liveblocks, not in this database, so deleting a
   board here would otherwise leave its room behind for ever. Scheduled from
   the mutation rather than awaited, so a failure at their end cannot roll
   back a deletion that has already happened. */
export const deleteRooms = internalAction({
  args: {
    roomIds: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;

    if (!secret) {
      console.warn(
        'LIVEBLOCKS_SECRET_KEY is not set on this deployment, so ' +
          `${args.roomIds.length} room(s) were left in place. Set it with ` +
          '`npx convex env set LIVEBLOCKS_SECRET_KEY <key>`.'
      );
      return;
    }

    for (const roomId of args.roomIds) {
      const response = await fetch(`${API}/${roomId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      });

      /* A room that was never opened does not exist there, which is not a
         failure: nothing was left behind. */
      if (!response.ok && response.status !== 404) {
        console.error(
          `Could not delete Liveblocks room ${roomId}: ${response.status}`
        );
      }
    }
  },
});
