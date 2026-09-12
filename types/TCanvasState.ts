export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
  scale: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
  Image,
  Diamond,
  Arrow,
  Line,
}

/* Every shape now carries its own outline, fill and opacity so the style panel
   has something to drive, the way a drawing tool is expected to work. */
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type EdgeStyle = 'sharp' | 'round';

export type LayerStyle = {
  fill: Color;
  stroke?: Color;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  edges?: EdgeStyle;
  opacity?: number;
  filled?: boolean;
};

type LayerBase = LayerStyle & {
  x: number;
  y: number;
  height: number;
  width: number;
  value?: string;
};

export type RectangleLayer = LayerBase & {
  type: LayerType.Rectangle;
};

export type DiamondLayer = LayerBase & {
  type: LayerType.Diamond;
};

export type EllipseLayer = LayerBase & {
  type: LayerType.Ellipse;
};

export type PathLayer = LayerBase & {
  type: LayerType.Path;
  points: number[][];
};

/* Arrows and lines are two points in the layer's own box, kept relative so a
   resize scales them with everything else. */
export type ArrowLayer = LayerBase & {
  type: LayerType.Arrow;
  points: number[][];
};

export type LineLayer = LayerBase & {
  type: LayerType.Line;
  points: number[][];
};

export type TextLayer = LayerBase & {
  type: LayerType.Text;
};

export type NoteLayer = LayerBase & {
  type: LayerType.Note;
};

export type ImageLayer = LayerBase & {
  type: LayerType.Image;
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type TCanvasState =
  | {
      mode: CanvasMode.None;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.SelectingNet;
      origin: Point;
      current?: Point;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Diamond
        | LayerType.Arrow
        | LayerType.Line
        | LayerType.Text
        | LayerType.Note
        | LayerType.Image
        | undefined;
      origin?: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Pencil;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.Erasing;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.Hand;
      layerType: undefined;
    }
  | {
      mode: CanvasMode.Panning;
      layerType: undefined;
      returnTo: TCanvasState;
    }
  | {
      mode: CanvasMode.Pressing;
      layerType: undefined;
      origin: Point;
    }
  | {
      mode: CanvasMode.Resizing;
      layerType: undefined;
      initialBounds: XYWH;
      corner: Side;
    };

export enum CanvasMode {
  None,
  Pressing,
  SelectingNet,
  Translating,
  Inserting,
  Resizing,
  Pencil,
  Erasing,
  Hand,
  Panning,
}

export type Layer =
  | RectangleLayer
  | DiamondLayer
  | EllipseLayer
  | PathLayer
  | ArrowLayer
  | LineLayer
  | TextLayer
  | NoteLayer
  | ImageLayer;
