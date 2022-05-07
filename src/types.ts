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
 * Function that will be called when the diagram is clicked.
 */
export type OnClick = (coord: FretCoord, elem: SVGSVGElement, state: FretboardState) => any;

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
  showHoverDot: boolean;
  hoverDotColor: string;
  label?: string;
  onClick?: OnClick;
}

/**
 * Fretboard data that will be calculated from the given Opts.
 */
export interface FretboardData {
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
