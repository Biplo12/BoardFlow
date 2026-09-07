import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import PEEP_FIGURES, {
  PEEP_FIGURE_HEIGHT,
  TPeepFigure,
} from '@/constant/peeps';

interface PeepProps {
  figure: TPeepFigure;
  className?: string;
  priority?: boolean;
}

const Peep: React.FC<PeepProps> = ({
  figure,
  className,
  priority,
}): JSX.Element => {
  return (
    <Image
      src={`/illustrations/peeps/figure/${figure}.svg`}
      alt=''
      aria-hidden
      width={PEEP_FIGURES[figure]}
      height={PEEP_FIGURE_HEIGHT}
      priority={priority}
      className={cn('h-auto w-auto max-w-none select-none', className)}
    />
  );
};
export default Peep;
