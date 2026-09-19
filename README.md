# BoardFlow

A collaborative whiteboard your whole team draws on at once. Shapes, arrows,
sticky notes, freehand ink and text on an infinite canvas, with everyone's
cursor moving next to yours.

**[board-flow.vercel.app](https://board-flow.vercel.app)**

---

## What it does

**The canvas.** Twelve tools on one strip, each on a number key: hand, select,
rectangle, diamond, ellipse, arrow, line, freehand draw, text, sticky note,
image and eraser. Every shape carries its own stroke colour, fill, weight,
dash pattern, corner style and opacity, set before you draw or changed on
anything already selected.

Holding shift squares a shape and snaps a line to fifteen degrees. Alt-drag
duplicates. Marquee, shift-click, align, distribute and layer order all work
on a multiple selection at once. The eraser sweeps a path, fades what it
touches and deletes on release, as a single step you can undo.

**Together.** Everyone on a board carries a labelled pointer, and a shape is
broadcast while it is being dragged out rather than appearing when you let go.
Undo is per person: yours steps back over your own last change and leaves
everyone else's alone.

**Organizations.** Boards belong to an organization, not a person. Invite by
email, accept from the panel behind your avatar, and manage members, roles,
invitations and boards from one place.

## Built with

| | |
| --- | --- |
| [Next.js 16](https://nextjs.org) | App Router, React 19, Turbopack |
| [TypeScript](https://www.typescriptlang.org) | strict |
| [Convex](https://convex.dev) | database, server functions, live queries |
| [Convex Auth](https://labs.convex.dev/auth) | password, Google, GitHub, magic link |
| [Liveblocks](https://liveblocks.io) | board contents, presence, live cursors |
| [Tailwind CSS 4](https://tailwindcss.com) | with [shadcn/ui](https://ui.shadcn.com) on Radix |
| [Vitest](https://vitest.dev) | the canvas maths and renderers |

## Running it locally

You need **Node 22 or newer** (nanoid refuses to install below it), Yarn, and a
free account on [Convex](https://convex.dev) and [Liveblocks](https://liveblocks.io).
Both have a free tier that covers this.

**1. Install**

```bash
git clone https://github.com/Biplo12/BoardFlow.git
cd BoardFlow
yarn install
cp .env.example .env.local
```

**2. Create your Convex deployment**

```bash
npx convex dev
```

It signs you in, creates a deployment and writes `CONVEX_DEPLOYMENT` and
`NEXT_PUBLIC_CONVEX_URL` into `.env.local` for you. **Leave it running** — it
watches `convex/` and pushes functions as you save them.

**3. Set up authentication**

In a second terminal:

```bash
npx @convex-dev/auth
```

This generates the signing keys and puts `JWT_PRIVATE_KEY`, `JWKS` and
`SITE_URL` on the deployment. When it asks for the site URL, give it the
address you will actually open, including the port — `http://localhost:3000`
unless you change it. Getting this wrong is the usual reason sign-in bounces
you back to the login page.

**4. Add your Liveblocks key**

Take the secret key from your Liveblocks dashboard and put it in `.env.local`:

```
LIVEBLOCKS_SECRET_KEY=sk_dev_...
```

Without it the app builds and you can sign in, but boards will not open:
`app/api/liveblocks-auth/route.ts` uses it to sign the room session.

**5. Go**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, make an
organization, and open a board.

### Optional: sign in with Google

```bash
npx convex env set AUTH_GOOGLE_ID <client id>
npx convex env set AUTH_GOOGLE_SECRET <client secret>
```

Then add this to the authorised redirect URIs of your Google OAuth client,
using your own deployment name:

```
https://<your-deployment>.convex.site/api/auth/callback/google
```

Note `.convex.site`, not `.convex.cloud` — the callback goes to the HTTP
actions domain. Google takes anywhere from five minutes to a few hours to
honour a new URI, so a `redirect_uri_mismatch` right after saving usually
means "not yet" rather than "wrong".

## Scripts

| | |
| --- | --- |
| `yarn dev` | development server |
| `yarn build` | production build |
| `yarn start` | serve a production build |
| `yarn lint` | eslint |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn test` | vitest, once |
| `yarn test:watch` | vitest, watching |

CI runs lint, typecheck, test and build on every push and pull request.

### Filling a board with an example

```bash
node scripts/seed-board.mjs <boardId> --replace
```

Writes a ready-made diagram into a board through the Liveblocks REST API. Take
the id out of the `/board/<id>` address. Handy for screenshots, and it doubles
as an end-to-end check of the layer schema: it has to write exactly the fields
the canvas reads.

## How it is laid out

```
app/              routes: (home), (auth), dashboard, board/[boardId], api/
components/       grouped by feature — Canvas/, Dashbaord/, Home/, Layout/, ui/
convex/           schema and server functions; _generated/ is not hand-edited
hooks/            one hook per file
lib/              pure helpers, including the canvas maths
tests/            vitest, against lib/ and the shape renderers
```

The canvas keeps its geometry in pure modules under `lib/canvas-*.ts` —
hit testing, resizing, ordering, style resolution — so it can be tested
without a Liveblocks room. Anything added there wants a test beside it.

`CLAUDE.md` describes the conventions the code follows, and is worth a read
before a first change.

## Deploying

The frontend runs on Vercel, the backend on Convex. So the two never drift
apart, set the Vercel build command to:

```
npx convex deploy --cmd 'next build'
```

and add `CONVEX_DEPLOY_KEY` to the project. Production also needs
`NEXT_PUBLIC_CONVEX_URL` and `LIVEBLOCKS_SECRET_KEY` on Vercel, and its own
`SITE_URL`, `JWT_PRIVATE_KEY`, `JWKS` and Google credentials on the Convex
production deployment — separate signing keys from development, and `SITE_URL`
pointing at your stable domain rather than a per-deployment URL.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) covers the workflow and the house style.
Security reports go through [SECURITY.md](SECURITY.md).

## Licence

[MIT](LICENSE).
