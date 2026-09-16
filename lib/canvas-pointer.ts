import React from 'react';

const isEditing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.closest('[contenteditable="true"]'));

/* Without this the browser starts its own text or image drag, fires
   pointercancel, and every gesture that holds the button dies halfway. The
   capture keeps the moves coming even when the pointer leaves the element. */
export function claimPointer(e: React.PointerEvent, surface: Element | null) {
  if (!isEditing(e.target)) {
    e.preventDefault();
  }

  /* A pointer the browser has already forgotten throws here, and losing the
     capture must never take the rest of the gesture down with it. */
  try {
    surface?.setPointerCapture?.(e.pointerId);
  } catch {
    /* the gesture still works, it just is not captured */
  }
}

export function surfaceOf(element: Element) {
  return element instanceof SVGElement && element.ownerSVGElement
    ? element.ownerSVGElement
    : element;
}
