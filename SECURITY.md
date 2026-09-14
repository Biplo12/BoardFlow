# Security

## Reporting a vulnerability

Please do not open a public issue for anything exploitable. Use GitHub's
[private vulnerability reporting](https://github.com/Biplo12/BoardFlow/security/advisories/new)
instead, or email the address on the maintainer's GitHub profile.

Include what you did, what happened, and what you expected. A proof of concept
helps. You will get an acknowledgement within a few days.

## Scope

The interesting surfaces are:

- `convex/` — every query and mutation is its own authorisation boundary. They
  gate on `getAuthUserId` and then on membership of the organization that owns
  the row. A function that reads or writes without both checks is a bug worth
  reporting.
- `app/api/liveblocks-auth/route.ts` — issues the room session. It decides
  which board a signed-in person may join.
- Board content is shared, mutable, multi-user text. It is stored as plain
  text and escaped on the way back into the DOM (`htmlToPlainText` and
  `plainTextToHtml` in `lib/utils.ts`). Anything that gets markup past those
  and into another person's browser is a stored XSS and in scope.

## Not in scope

Missing rate limits on a self-hosted deployment, issues that need physical or
local access to a signed-in machine, and anything in a dependency that already
has a public advisory.
