# Contributing

Thanks for taking the time. This is a small project, so the process is short.

## Running it locally

You need Node 20+, Yarn, a free [Convex](https://convex.dev) project and a free
[Liveblocks](https://liveblocks.io) project.

```bash
yarn install
cp .env.example .env.local
npx convex dev      # creates the deployment and fills in the Convex variables
yarn dev            # in a second terminal
```

Convex has to keep running while you work: it watches `convex/` and pushes
functions on save. Auth providers are set on the deployment rather than in
`.env.local` — see the comments at the bottom of `.env.example`.

## Before you open a pull request

```bash
yarn lint
npx tsc --noEmit
yarn test
```

All three have to pass. CI runs the same three.

## House style

`CLAUDE.md` in the repo root is the full description, and it is worth reading
before the first change. The short version:

- Components are `const X: React.FC<XProps> = (props): JSX.Element => {}` with
  `export default X;` on the line straight after.
- Imports go through the `@/` alias and are sorted by the lint rule.
- Types live in `types/TXxx.ts`, constants in `constant/`, pure helpers in
  `lib/`, one hook per file in `hooks/`.
- The codebase is close to comment-free. Add one only where the reasoning is
  genuinely not visible in the code, such as a geometry step.
- Canvas maths goes in `lib/canvas-*.ts` as pure functions, so it can be
  tested without a Liveblocks room. Anything you add there wants a test in
  `tests/`.

## Commits

Short, imperative subjects (`fix: keep the badge with the avatar`). Branch off
`dev`, not `main`.
