import type { Metadata } from 'next';
import React from 'react';

import LegalList from '@/components/Layout/Home/Legal/LegalList';
import LegalPage, {
  ACCENTS,
} from '@/components/Layout/Home/Legal/LegalPage';
import LegalSection from '@/components/Layout/Home/Legal/LegalSection';
import LegalText from '@/components/Layout/Home/Legal/LegalText';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What BoardFlow stores, where it goes, and how to get rid of it.',
};

const COLLECTED = [
  {
    term: 'Your account',
    detail:
      'Your email address, the name and avatar you sign up with, and either a hashed password or the identifier your Google or GitHub account returns. We never see your password in readable form, and we never receive your password for Google or GitHub.',
  },
  {
    term: 'Your organizations',
    detail:
      'The name of every organization you create or join, who owns it, and whether you are an admin or a member of it.',
  },
  {
    term: 'Invitations you send',
    detail:
      'The email address you invite, the role you invited it as, and who sent it. An invitation expires after seven days and is deleted the moment it is accepted, declined or withdrawn.',
  },
  {
    term: 'Your boards',
    detail:
      'The title, who created it, which organization it belongs to, which boards you marked as favourites, and everything drawn on the canvas: shapes, text, notes, freehand strokes and image addresses.',
  },
  {
    term: 'While a board is open',
    detail:
      'Your pointer position, what you have selected and the stroke you are drawing are sent to the other people on that board so they can see you working. This is live only and is not written to the database.',
  },
];

const PROCESSORS = [
  {
    term: 'Convex',
    detail:
      'Holds the database and runs sign-in. Your account, organizations, invitations and board records live here.',
  },
  {
    term: 'Liveblocks',
    detail:
      'Holds the contents of each board and carries the live cursors. To label your cursor for the others we send it your user id, your display name and your avatar address.',
  },
  {
    term: 'Google and GitHub',
    detail:
      'Only if you choose to sign in with them, and only to confirm who you are. They tell us your email address, name and avatar.',
  },
  {
    term: 'Resend',
    detail:
      'Only if you sign in with a link sent to your email address.',
  },
];

export default function PrivacyPage(): JSX.Element {
  return (
    <LegalPage
      title='Privacy'
      updated='12 September 2026'
      intro='BoardFlow is a whiteboard. It needs an account to know which boards are yours and who else may open them, and it needs to move what you draw between the people on a board. That is the whole reason it holds anything about you.'
    >
      <LegalSection heading='What is collected' accent={ACCENTS[0]}>
        <LegalList items={COLLECTED} accent={ACCENTS[0]} />
      </LegalSection>

      <LegalSection heading='What is not collected' accent={ACCENTS[1]}>
        <LegalText>
          There is no analytics, no tracking pixel and no advertising of any
          kind. Nothing you draw is read, mined or used to train anything. The
          only thing kept in your browser is which organization you were last
          looking at, so the dashboard opens where you left it; it is not a
          cookie and it never leaves your machine.
        </LegalText>
      </LegalSection>

      <LegalSection heading='Who else it reaches' accent={ACCENTS[2]}>
        <LegalText>
          Anyone in an organization you belong to can open every board in that
          organization, see what you drew and see your name and avatar on your
          cursor. Beyond that, your data is handled only by the services that
          make the product work:
        </LegalText>
        <LegalList items={PROCESSORS} accent={ACCENTS[2]} />
        <LegalText>
          Nothing is sold, rented or handed to anybody else, other than where
          the law leaves no choice.
        </LegalText>
      </LegalSection>

      <LegalSection heading='How long it is kept' accent={ACCENTS[3]}>
        <LegalText>
          Board content stays until somebody deletes the board. Deleting a board
          removes it and everyone&apos;s favourites of it. Deleting an
          organization removes its boards, its memberships and its outstanding
          invitations. Your account stays until you ask for it to be removed.
        </LegalText>
      </LegalSection>

      <LegalSection heading='What you can ask for' accent={ACCENTS[4]}>
        <LegalText>
          You can ask for a copy of everything held about you, ask for it to be
          corrected, or ask for your account and its boards to be deleted, and
          it will be done. Write to the address below. If you are in the UK or
          the EU, these are your rights under the GDPR and you can also complain
          to your national data protection authority.
        </LegalText>
      </LegalSection>

      <LegalSection heading='Getting in touch' accent={ACCENTS[5]}>
        <LegalText>
          BoardFlow is run by Robert Siński. Questions about any of this, or a
          request about your data, go to the email address on the maintainer
          profile at github.com/Biplo12. If this becomes a company rather than a
          personal project, this page will name it here.
        </LegalText>
      </LegalSection>
    </LegalPage>
  );
}
