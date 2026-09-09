import { describe, expect, it } from 'vitest';

import { AlignItem, alignPositions } from '@/lib/canvas-align';
import { htmlToPlainText, orgTint, peepFace, plainTextToHtml } from '@/lib/utils';

const item = (
  id: string,
  x: number,
  y: number,
  width = 50,
  height = 40
): AlignItem => ({ id, x, y, width, height });

describe('aligning a selection', () => {
  const spread = [item('a', 0, 0, 50, 40), item('b', 100, 25, 30, 60), item('c', 200, 90, 80, 20)];

  it('does nothing to a selection of one', () => {
    expect(alignPositions([item('a', 10, 10)], 'left')).toEqual({});
  });

  it('puts every left edge on the leftmost edge', () => {
    const moves = alignPositions(spread, 'left');
    expect(new Set(Object.values(moves))).toEqual(new Set([0]));
  });

  it('puts every right edge on the rightmost edge', () => {
    const moves = alignPositions(spread, 'right');
    const rights = spread.map((i) => moves[i.id] + i.width);
    expect(new Set(rights)).toEqual(new Set([280]));
  });

  it('centres every layer on the same axis', () => {
    const moves = alignPositions(spread, 'center-x');
    const centres = spread.map((i) => moves[i.id] + i.width / 2);
    expect(new Set(centres.map((c) => Math.round(c)))).toEqual(new Set([140]));
  });

  it('aligns on the y axis for the vertical variants', () => {
    const moves = alignPositions(spread, 'top');
    expect(new Set(Object.values(moves))).toEqual(new Set([0]));
  });

  it('refuses to distribute fewer than three', () => {
    expect(alignPositions(spread.slice(0, 2), 'distribute-x')).toEqual({});
  });

  it('leaves the outermost two where they were when distributing', () => {
    const moves = alignPositions(spread, 'distribute-x');
    expect(moves.a).toBe(0);
    expect(moves.c + 80).toBeCloseTo(280);
  });

  it('leaves equal gaps when distributing', () => {
    const moves = alignPositions(spread, 'distribute-x');
    const ordered = [...spread].sort((p, q) => moves[p.id] - moves[q.id]);
    const gaps: number[] = [];

    for (let i = 0; i < ordered.length - 1; i++) {
      gaps.push(moves[ordered[i + 1].id] - (moves[ordered[i].id] + ordered[i].width));
    }

    expect(gaps[0]).toBeCloseTo(gaps[1]);
  });

  it('never moves a layer on the axis it was not asked about', () => {
    const moves = alignPositions(spread, 'left');
    expect(Object.keys(moves).sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('board text is never markup', () => {
  const payloads = [
    '<img src=x onerror=alert(1)>',
    '<script>alert(1)</script>hello',
    '<svg/onload=alert(1)>',
    '<a href="javascript:alert(1)">click</a>',
    '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
    '<div style="position:fixed;inset:0">overlay</div>',
  ];

  it.each(payloads)('strips %s down to text on the way in', (payload) => {
    const stored = htmlToPlainText(payload);
    expect(stored).not.toMatch(/<[a-z/!]/i);
  });

  it.each(payloads)('escapes %s on the way back out', (payload) => {
    const rendered = plainTextToHtml(htmlToPlainText(payload));
    expect(rendered).not.toMatch(/<(?!br>)/i);
  });

  it('escapes markup that is already sitting in storage', () => {
    const rendered = plainTextToHtml('<img src=x onerror=alert(1)>');
    expect(rendered).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('keeps ordinary punctuation readable', () => {
    const text = 'Kowalski & Sons "quoted" 5 > 3';
    expect(htmlToPlainText(plainTextToHtml(text))).toBe(text);
  });

  it('survives a multi-line round trip', () => {
    const text = 'first\nsecond\nthird';
    expect(htmlToPlainText(plainTextToHtml(text))).toBe(text);
  });

  it('turns the browser div wrapping into newlines', () => {
    expect(htmlToPlainText('one<div>two</div><div>three</div>')).toBe(
      'one\ntwo\nthree'
    );
  });
});

describe('identity colours are stable', () => {
  it('gives the same face for the same id every time', () => {
    const a = peepFace('user_abc123');
    const b = peepFace('user_abc123');
    expect(a).toEqual(b);
  });

  it('gives different faces for different ids', () => {
    const seeds = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'];
    const faces = new Set(seeds.map((s) => peepFace(s).face));
    expect(faces.size).toBeGreaterThan(1);
  });

  it('would have given a different face for a membership id than a user id', () => {
    expect(peepFace('user_abc123').face).not.toBe(
      peepFace('membership_abc123').face
    );
  });

  it('always resolves to a real asset name and tint', () => {
    for (let i = 0; i < 200; i++) {
      const { face, tint } = peepFace(`seed-${i}`);
      expect(face).toMatch(/^[a-z]+$/);
      expect(tint).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('always resolves an org tint with readable ink', () => {
    for (let i = 0; i < 100; i++) {
      const tint = orgTint(`org-${i}`);
      expect(tint.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(['#ffffff', '#111111']).toContain(tint.ink);
    }
  });
});
