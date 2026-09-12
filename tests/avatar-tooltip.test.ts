import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import UserAvatar from '@/components/common/UserAvatar';
import { TooltipProvider } from '@/components/ui/tooltip';

const render = (name: string, seed: string) =>
  renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(UserAvatar, { name, seed })
    )
  );

describe('a participant avatar carries its own tooltip', () => {
  it('lets the tooltip put its own props on the avatar', () => {
    expect(render('Robert', 'user_1')).toContain('data-state="closed"');
  });

  it('describes the avatar to a screen reader as well', () => {
    expect(render('Robert', 'user_1')).toMatch(/aria-describedby|data-state/);
  });
});
