import type { Metadata } from 'next';
import React from 'react';

import LegalList from '@/components/Layout/Home/Legal/LegalList';
import LegalPage, {
  ACCENTS,
} from '@/components/Layout/Home/Legal/LegalPage';
import LegalSection from '@/components/Layout/Home/Legal/LegalSection';
import LegalText from '@/components/Layout/Home/Legal/LegalText';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The rules for using BoardFlow, in plain language.',
};

const RULES = [
  {
    term: 'One account per person',
    detail:
      'Keep your sign-in details to yourself. Anything done from your account is treated as done by you.',
  },
  {
    term: 'Invite people you mean to invite',
    detail:
      'Anyone who accepts an invitation can open every board in that organization, so only invite addresses you intend to give that access to.',
  },
  {
    term: 'Do not put illegal or harmful content on a board',
    detail:
      'That includes anything you have no right to share, and anything meant to attack somebody else.',
  },
  {
    term: 'Do not attack the service',
    detail:
      'No attempts to break authentication, reach boards you were not invited to, or overload the servers. If you find a way to do any of those, the security policy in the repository explains how to report it.',
  },
];

export default function TermsPage(): JSX.Element {
  return (
    <LegalPage
      title='Terms'
      updated='12 September 2026'
      tone='ink'
      background='#fbfce9'
      intro='BoardFlow is free, open source and run as a personal project. These are the rules for using it, written the way they are meant to be read.'
    >
      <LegalSection heading='What you are agreeing to' accent={ACCENTS[0]} index={1}>
        <LegalText>
          By making an account you accept what is on this page. If you do not,
          do not make one. The source is public under the MIT licence, so you
          are also free to run your own copy instead, on your own terms.
        </LegalText>
      </LegalSection>

      <LegalSection heading='Using it sensibly' accent={ACCENTS[1]} index={2}>
        <LegalList items={RULES} accent={ACCENTS[1]} />
      </LegalSection>

      <LegalSection heading='What you draw stays yours' accent={ACCENTS[2]} index={3}>
        <LegalText>
          Everything you put on a board belongs to you. Nothing on it is claimed
          or licensed by running the service. The only thing done with it is
          storing it and showing it to the people you shared the board with. The
          MIT licence covers the software, not your content.
        </LegalText>
      </LegalSection>

      <LegalSection heading='What is not promised' accent={ACCENTS[3]} index={4}>
        <LegalText>
          This is a free service run by one person. There is no uptime
          guarantee, no support commitment and no promise that a board will
          still be there tomorrow. Deletions are permanent and there is no
          backup you can ask to be restored from. Anything you cannot afford to
          lose should be exported or kept somewhere else as well.
        </LegalText>
        <LegalText>
          The service is provided as it is, without warranty of any kind. To the
          extent the law allows, nobody running it is liable for any loss
          arising from using it, including lost work or lost data. Access can be
          suspended or removed if an account is used to break these rules.
        </LegalText>
      </LegalSection>

      <LegalSection heading='Changes' accent={ACCENTS[4]} index={5}>
        <LegalText>
          These terms can change as the product does. The date at the top says
          when they last did, and the history of every change is public in the
          repository. Continuing to use BoardFlow after a change means the new
          version applies.
        </LegalText>
      </LegalSection>

      <LegalSection heading='Getting in touch' accent={ACCENTS[5]} index={6}>
        <LegalText>
          BoardFlow is run by Robert Siński. Anything about these terms goes to
          the email address on the maintainer profile at github.com/Biplo12.
        </LegalText>
      </LegalSection>
    </LegalPage>
  );
}
