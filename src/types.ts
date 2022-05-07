export interface Point {
  x: number;
  y: number;
}

/**
 * A string and fret on the fretboard.
 */
export interface FretCoord {
  string: number;
  fret: number;
}

/**
 * A FretCoord with an optional color.
 * Represents a dot drawn on the fretboard diagram.
 */
export interface Dot extends FretCoord {
  color?: string;
}

/**
 * The settings used by a fretboard diagram.
 */
export interface Opts {
  className: string;
  width: number;
  height: number;
  startFret: number;
  endFret: number;
  showFretNums: boolean;
  stringNames: string[]
  showStringNames: boolean;
  dots: Dot[];
  dotColor: string;
  drawDotOnHover: boolean;
  hoverDotColor: string;
  label?: string;
  onClick?: (coord: FretCoord, elem: SVGSVGElement, state: FretboardState) => any;
}

/**
 * Fretboard data that will be calculated from the given Opts.
 */
export type FretboardData = {
  xMargin: number;
  yMargin: number;
  neckWidth: number;
  neckHeight: number;
  stringCount: number;
  stringMargin: number;
  fretCount: number;
  fretHeight: number;
  fretNumOffset: number;
  dotRadius: number;
}

/**
 * An object combining the keys of Opts and FretboardData.
 */
export type FretboardState = Opts & FretboardData;
