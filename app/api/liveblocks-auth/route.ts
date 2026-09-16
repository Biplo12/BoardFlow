import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  const token = await convexAuthNextjsToken();

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  const user = await convex.query(api.users.viewer, {});

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { room: roomId } = await req.json();

  let board;

  try {
    board = await convex.query(api.board.get, {
      id: roomId as Id<'boards'>,
    });
  } catch {
    return new Response('Unauthorized', { status: 403 });
  }

  if (!board) {
    return new Response('Not Found', { status: 404 });
  }

  const userInfo = {
    userId: user._id,
    name: user.name ?? user.email ?? 'Teammate',
    picture: user.image ?? '',
  };

  const session = liveblocks.prepareSession(user._id, { userInfo });

  if (roomId) {
    session.allow(roomId, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
