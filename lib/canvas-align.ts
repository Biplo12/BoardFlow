export type Alignment =
  | 'left'
  | 'center-x'
  | 'right'
  | 'top'
  | 'center-y'
  | 'bottom'
  | 'distribute-x'
  | 'distribute-y';

const VERTICAL: Alignment[] = ['top', 'center-y', 'bottom', 'distribute-y'];

export type AlignItem = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/* Pure so it can be tested without a Liveblocks room: takes the selection and
   returns only the positions that need writing back. */
export function alignPositions(
  items: AlignItem[],
  alignment: Alignment
): Record<string, number> {
  if (items.length < 2) return {};

  const vertical = VERTICAL.includes(alignment);
  const position = vertical ? 'y' : 'x';
  const size = vertical ? 'height' : 'width';

  const start = Math.min(...items.map((item) => item[position]));
  const end = Math.max(...items.map((item) => item[position] + item[size]));

  const moves: Record<string, number> = {};

  if (alignment === 'distribute-x' || alignment === 'distribute-y') {
    if (items.length < 3) return {};

    const ordered = [...items].sort((a, b) => a[position] - b[position]);
    const occupied = ordered.reduce((total, item) => total + item[size], 0);
    const gap = (end - start - occupied) / (ordered.length - 1);

    let offset = start;

    for (const item of ordered) {
      moves[item.id] = offset;
      offset += item[size] + gap;
    }

    return moves;
  }

  for (const item of items) {
    if (alignment === 'left' || alignment === 'top') {
      moves[item.id] = start;
    } else if (alignment === 'right' || alignment === 'bottom') {
      moves[item.id] = end - item[size];
    } else {
      moves[item.id] = (start + end - item[size]) / 2;
    }
  }

  return moves;
}

export function alignmentAxis(alignment: Alignment): 'x' | 'y' {
  return VERTICAL.includes(alignment) ? 'y' : 'x';
}
