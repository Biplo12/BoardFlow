'use client';

import React, { useEffect } from 'react';

const RevealOnScroll: React.FC = (): null => {
  useEffect(() => {
    const root = document.documentElement;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!targets.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.classList.add('reveal-ready');

    if (reduced.matches) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    /* No negative root margin: an element sitting at the very bottom of the
       document could never clear one, and would stay hidden for good. */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    });

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);

  return null;
};
export default RevealOnScroll;
