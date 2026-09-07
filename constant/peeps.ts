/* Generated from the Open Peeps atoms, see public/illustrations/CREDITS.md.
   Every figure shares one box height so the whole cast keeps a single scale,
   and each box ends at that figure's feet so a row of them stands level. */
const PEEP_FIGURE_HEIGHT = 3170;

const PEEP_FIGURES = {
  'pointing': 1340,
  'arms-crossed': 1110,
  'hands-on-hips': 1087,
  'resting': 1314,
  'walking': 1076,
  'easing': 1115,
  'shirt': 935,
  'blazer': 1087,
  'standing': 1314,
  'explaining': 1340,
  'posing': 1087,
  'leaning': 1115,
} as const;

export type TPeepFigure = keyof typeof PEEP_FIGURES;
export { PEEP_FIGURE_HEIGHT };
export default PEEP_FIGURES;
