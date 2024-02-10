import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const COLORS = ['#dc2626', '#059669', '#2563eb', '#d97706', '#d97706'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomBorderColor(index: number) {
  return COLORS[index % COLORS.length];
}
