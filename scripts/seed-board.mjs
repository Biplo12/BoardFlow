#!/usr/bin/env node
/*
 * Fills a board with a ready-made diagram by writing the room's Storage
 * through the Liveblocks REST API.
 *
 *   node scripts/seed-board.mjs <boardId> [--replace]
 *
 * A board that has been opened already holds Storage, and Liveblocks will only
 * initialize an empty room. Pass --replace to clear what is there first, which
 * erases everything drawn on that board.
 *
 * The board row has to exist first: make one in the dashboard and take the id
 * out of the /board/<id> address. The secret key is read from the environment,
 * never passed on the command line.
 *
 * Every field written here is the one the canvas actually reads, so if this
 * script produces a board that renders, the layer schema on production is
 * sound end to end.
 */

import { readFileSync } from 'node:fs';

const API = 'https://api.liveblocks.io/v2';

const roomId = process.argv[2];
const replace = process.argv.includes('--replace');

if (!roomId) {
  console.error('Usage: node scripts/seed-board.mjs <boardId> [--replace]');
  process.exit(1);
}

/* .env is not loaded for a plain node script, so read it the same way the app
   would and let a real environment variable win. */
const fromEnvFile = (name) => {
  for (const file of ['.env.local', '.env']) {
    try {
      const line = readFileSync(file, 'utf8')
        .split('\n')
        .find((row) => row.startsWith(`${name}=`));

      if (line) return line.slice(name.length + 1).trim().replace(/^"|"$/g, '');
    } catch {
      /* the file simply is not there */
    }
  }

  return undefined;
};

const secret = process.env.LIVEBLOCKS_SECRET_KEY ?? fromEnvFile('LIVEBLOCKS_SECRET_KEY');

if (!secret) {
  console.error(
    'LIVEBLOCKS_SECRET_KEY is not set, and neither .env.local nor .env carries it.'
  );
  process.exit(1);
}

// LayerType, in the order the enum declares it.
const RECTANGLE = 0;
const ELLIPSE = 1;
const PATH = 2;
const TEXT = 3;
const NOTE = 4;
const DIAMOND = 6;
const ARROW = 7;
const LINE = 8;

const INK = { r: 30, g: 30, b: 30 };
const RED = { r: 224, g: 49, b: 49 };
const GREEN = { r: 47, g: 158, b: 68 };
const BLUE = { r: 25, g: 113, b: 194 };
const ORANGE = { r: 240, g: 140, b: 0 };
const SKY = { r: 165, g: 216, b: 255 };
const MINT = { r: 178, g: 242, b: 187 };
const PINK = { r: 255, g: 201, b: 201 };
const BUTTER = { r: 255, g: 236, b: 153 };

const layers = {};
const layerIds = [];

/* Paint order is the order of layerIds, so whatever is added last sits on top. */
const add = (layer) => {
  const id = crypto.randomUUID();

  layers[id] = { liveblocksType: 'LiveObject', data: layer };
  layerIds.push(id);

  return id;
};

const shape = (type, x, y, width, height, style) =>
  add({
    type,
    x,
    y,
    width,
    height,
    fill: style.background ?? style.stroke ?? INK,
    stroke: style.stroke ?? INK,
    strokeWidth: style.strokeWidth ?? 4,
    strokeStyle: style.strokeStyle ?? 'solid',
    edges: style.edges ?? 'round',
    opacity: style.opacity ?? 100,
    filled: style.background != null,
  });

const text = (x, y, width, height, value, colour = INK) =>
  add({
    type: TEXT,
    x,
    y,
    width,
    height,
    value,
    fill: colour,
    stroke: colour,
    strokeWidth: 4,
    strokeStyle: 'solid',
    edges: 'round',
    opacity: 100,
    filled: true,
  });

const note = (x, y, width, height, value, colour = BUTTER) =>
  add({
    type: NOTE,
    x,
    y,
    width,
    height,
    value,
    fill: colour,
    stroke: INK,
    strokeWidth: 2,
    strokeStyle: 'solid',
    edges: 'round',
    opacity: 100,
    filled: true,
  });

/* A segment carries its two ends relative to its own box, because both
   diagonals of a box would otherwise look identical. */
const segment = (type, x1, y1, x2, y2, style = {}) => {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);

  return add({
    type,
    x,
    y,
    width: Math.max(1, Math.abs(x2 - x1)),
    height: Math.max(1, Math.abs(y2 - y1)),
    points: [
      [x1 - x, y1 - y],
      [x2 - x, y2 - y],
    ],
    fill: style.stroke ?? INK,
    stroke: style.stroke ?? INK,
    strokeWidth: style.strokeWidth ?? 4,
    strokeStyle: style.strokeStyle ?? 'solid',
    edges: 'round',
    opacity: style.opacity ?? 100,
    filled: true,
  });
};

const arrow = (x1, y1, x2, y2, style) => segment(ARROW, x1, y1, x2, y2, style);
const line = (x1, y1, x2, y2, style) => segment(LINE, x1, y1, x2, y2, style);

/* A hand-drawn wave, stored the way the pen stores it: points relative to the
   layer box, each carrying a pressure. */
const squiggle = (x, y, width, amplitude, colour = RED) => {
  const points = [];

  for (let step = 0; step <= 48; step++) {
    const t = step / 48;

    points.push([
      t * width,
      amplitude + Math.sin(t * Math.PI * 4) * amplitude,
      0.5,
    ]);
  }

  return add({
    type: PATH,
    x,
    y,
    width,
    height: amplitude * 2,
    points,
    fill: colour,
    stroke: colour,
    strokeWidth: 2,
    opacity: 100,
    filled: true,
  });
};

/* A labelled box is a rectangle with a text layer centred on it, which is
   exactly how you would build one by hand on the canvas. */
const labelled = (x, y, width, height, label, background, stroke) => {
  shape(RECTANGLE, x, y, width, height, { background, stroke });
  text(x + 14, y + height / 2 - 22, width - 28, 44, label);
};

// ---------------------------------------------------------------- the board
/* A quarter kickoff, laid out the way a team would actually leave one.
 *
 * One rule drives the sizing: a note or a text layer renders at
 * min(height / 2, width / 2, 96) px, so a tall box makes enormous type. Sticky
 * notes therefore carry one or two words and are given room for them, while
 * anything sentence-length is a short, wide text layer instead. That is also
 * how a real board reads: nobody writes paragraphs on a sticky.
 */

const GREY = { r: 120, g: 130, b: 145 };

const tick = (x) => line(x, 936, x, 968, { stroke: INK, strokeWidth: 3 });

const caption = (x, y, width, value) => text(x, y, width, 40, value, GREY);

// --- header
text(90, 62, 520, 112, 'Q3 kickoff');
shape(ELLIPSE, 66, 46, 566, 142, { stroke: RED, strokeWidth: 4 });
squiggle(96, 198, 430, 8);
caption(700, 92, 420, 'Owners: Robert and Oska');
caption(700, 140, 420, 'Review on 30 Sep');

// --- the flow, inside a dotted frame that groups it
shape(RECTANGLE, 66, 262, 1390, 236, {
  stroke: GREY,
  strokeWidth: 2,
  strokeStyle: 'dotted',
  edges: 'sharp',
});

labelled(96, 306, 210, 96, 'Landing', SKY, BLUE);
arrow(312, 354, 356, 354, { stroke: INK, strokeWidth: 4 });
labelled(362, 306, 210, 96, 'Sign up', SKY, BLUE);
arrow(578, 354, 622, 354, { stroke: INK, strokeWidth: 4 });
labelled(628, 306, 210, 96, 'First board', MINT, GREEN);
arrow(844, 354, 888, 354, { stroke: INK, strokeWidth: 4 });

shape(DIAMOND, 888, 288, 250, 132, { background: BUTTER, stroke: ORANGE });
text(928, 332, 170, 44, 'activated?');

arrow(1142, 354, 1214, 354, { stroke: GREEN, strokeWidth: 4 });
text(1150, 300, 70, 40, 'yes', GREEN);
labelled(1220, 306, 210, 96, 'Invite team', MINT, GREEN);

arrow(1013, 424, 1013, 524, { stroke: RED, strokeWidth: 4, strokeStyle: 'dashed' });
text(1032, 450, 70, 40, 'no', RED);

note(860, 544, 340, 110, 'Onboarding', PINK);
caption(860, 668, 340, 'where most people stop');

// --- what the quarter produced
text(120, 726, 300, 124, '+30%', GREEN);
squiggle(126, 842, 230, 6, GREEN);
caption(120, 866, 320, 'activation');

text(500, 726, 300, 124, '1.8k', BLUE);
squiggle(506, 842, 190, 6, BLUE);
caption(500, 866, 340, 'boards made');

text(900, 726, 340, 124, '-12%', RED);
shape(ELLIPSE, 876, 712, 350, 150, { stroke: RED, strokeWidth: 4 });
caption(900, 878, 420, 'time to first draw');

// --- the quarter itself
line(110, 952, 1440, 952, { stroke: INK, strokeWidth: 4 });
[320, 760, 1200].forEach(tick);

shape(DIAMOND, 302, 934, 36, 36, { background: MINT, stroke: GREEN });
shape(DIAMOND, 742, 934, 36, 36, { background: BUTTER, stroke: ORANGE });
shape(DIAMOND, 1182, 934, 36, 36, { background: PINK, stroke: RED });

caption(286, 988, 120, 'Jul');
caption(726, 988, 120, 'Aug');
caption(1166, 988, 120, 'Sep');

// --- the pile nobody has dealt with yet, in a tidy column clear of the flow
caption(1560, 242, 320, 'Still open');
note(1560, 296, 320, 110, 'Pricing');
note(1560, 446, 320, 110, 'Mobile', PINK);
note(1560, 596, 320, 110, 'Invites', MINT);
arrow(1548, 352, 1448, 352, { stroke: GREY, strokeWidth: 2, strokeStyle: 'dashed' });

// ------------------------------------------------------------------ writing

const call = (method, path, body) =>
  fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

const document = {
  liveblocksType: 'LiveObject',
  data: {
    layers: { liveblocksType: 'LiveMap', data: layers },
    layerIds: { liveblocksType: 'LiveList', data: layerIds },
  },
};

let response = await call('POST', `/rooms/${roomId}/storage`, document);

if (response.status === 404) {
  /* Nobody has opened the board yet, so the room does not exist. It is created
     with no default access: the app grants a session write access per board
     after checking membership, and a world-writable room would hand the board
     to anyone holding the link. */
  const created = await call('POST', '/rooms', {
    id: roomId,
    defaultAccesses: [],
  });

  if (!created.ok) {
    console.error(`Could not create the room: ${created.status}`);
    console.error(await created.text());
    process.exit(1);
  }

  response = await call('POST', `/rooms/${roomId}/storage`, document);
}

if (response.status === 409) {
  if (!replace) {
    console.error('That board already has content on it.');
    console.error(
      'Re-run with --replace to wipe it and draw this diagram instead.'
    );
    process.exit(1);
  }

  const cleared = await call('DELETE', `/rooms/${roomId}/storage`);

  if (!cleared.ok) {
    console.error(`Could not clear the board: ${cleared.status}`);
    console.error(await cleared.text());
    process.exit(1);
  }

  response = await call('POST', `/rooms/${roomId}/storage`, document);
}

if (!response.ok) {
  console.error(`Storage was refused: ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}

console.log(`Wrote ${layerIds.length} layers to ${roomId}.`);
console.log('Reload the board to see it.');
