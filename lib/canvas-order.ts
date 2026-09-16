export type OrderDirection = 'back' | 'backward' | 'forward' | 'front';

export type OrderMove = { from: number; to: number };

const selectedIndices = (
  ids: readonly string[],
  selection: readonly string[]
) => {
  const indices: number[] = [];

  for (let index = 0; index < ids.length; index++) {
    if (selection.includes(ids[index])) {
      indices.push(index);
    }
  }

  return indices;
};

/* The paint order is a list, so reordering is a sequence of single moves. They
   are emitted in an order where each one leaves the indices of the moves still
   to come untouched, and the selection keeps its own relative order. */
export function orderMoves(
  ids: readonly string[],
  selection: readonly string[],
  direction: OrderDirection
): OrderMove[] {
  const indices = selectedIndices(ids, selection);

  if (!indices.length || indices.length === ids.length) {
    return [];
  }

  const moves: OrderMove[] = [];
  const push = (from: number, to: number) => {
    if (from !== to) moves.push({ from, to });
  };

  if (direction === 'back') {
    indices.forEach((from, position) => push(from, position));
    return moves;
  }

  if (direction === 'front') {
    for (let i = indices.length - 1; i >= 0; i--) {
      push(indices[i], ids.length - indices.length + i);
    }
    return moves;
  }

  if (direction === 'backward') {
    let floor = 0;

    for (let i = 0; i < indices.length; i++) {
      const to = Math.max(indices[i] - 1, floor);
      push(indices[i], to);
      floor = to + 1;
    }

    return moves;
  }

  let ceiling = ids.length - 1;

  for (let i = indices.length - 1; i >= 0; i--) {
    const to = Math.min(indices[i] + 1, ceiling);
    push(indices[i], to);
    ceiling = to - 1;
  }

  return moves;
}
