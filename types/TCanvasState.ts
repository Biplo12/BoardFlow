/* eslint-disable unused-imports/no-unused-vars */
export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
}

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
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
        | LayerType.Text
        | LayerType.Note
        | undefined;
    }
  | {
      mode: CanvasMode.Pencil;
      layerType: undefined;
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
}

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;
