import {
  Dot,
  FretboardData,
  FretboardState,
  FretCoord,
  Opts,
  Point,
} from "./types";
import {makeCircle, makeLine, makeSvgElement, makeText} from "./svg";

/**
 * Options for a 6-string guitar in standard tuning.
 */
const DEFAULT_OPTS: Opts = {
  className: 'fretboard-diagram',
  width: 200,
  height: 300,
  startFret: 1,
  endFret: 4,
  showFretNums: false,
  stringNames: ['E', 'B', 'G', 'D', 'A', 'E'],
  showStringNames: false,
  dots: [],
  dotColor: 'white',
  drawDotOnHover: false,
  hoverDotColor: 'white',
}

/**
 * The main exported function.
 * Will return an svg element with a depiction of a fretboard described by the given userOpts.
 */
export function makeFretboardDiagram(userOpts: Partial<Opts>, defaultOpts = DEFAULT_OPTS): SVGSVGElement {
  const opts: Opts = {...defaultOpts, ...userOpts}; // merge default and user opts
  const state: FretboardState = {...opts, ...fretboardData(opts)};

  const {width, height, className, dots, label, showFretNums, onClick} = opts;
  const elem = makeSvgElement(width, height, className);

  drawStrings(elem, state);
  drawFrets(elem, state);

  if (showFretNums) drawFretNums(elem, state);
  if (label) drawLabel(elem, state, label);
  if (dots.length) drawDots(elem, state, dots); // won't be called if dots.length is 0

  if (onClick) {
    elem.onclick = (event: MouseEvent) => {
      const coord = closestFretCoord(elem, state, event);
      onClick(coord, elem, state);
    }
  }

  return elem;
}

/**
 * Calculate fretboard data from the given opts.
 */
function fretboardData(opts: Opts): FretboardData {
  const {width, height, stringNames, label, startFret, endFret} = opts;

  const xMargin = width / 6;
  const yMarginOffset = label == '' ? 1 : 1.5;
  const yMargin = (height / 8) * yMarginOffset;

  const neckWidth = width - (xMargin * 2);
  const neckHeight = height - (yMargin * 2);

  const stringCount = stringNames.length;
  const stringMargin = neckWidth / (stringCount - 1);

  const fretCountOffset = startFret == 0 ? 0 : 1;
  const fretCount = (endFret - startFret) + fretCountOffset;

  const fretHeight = neckHeight / fretCount;
  const fretNumOffset = neckWidth / 6;

  const dotRadius = fretHeight / 6;

  return {
    xMargin,
    yMargin,
    neckWidth,
    neckHeight,
    stringCount,
    stringMargin,
    fretCount,
    fretHeight,
    fretNumOffset,
    dotRadius,
  };
}

function drawStrings(elem: SVGElement, state: FretboardState) {
  const {xMargin, yMargin, neckHeight, stringCount, stringMargin} = state;

  for (let i = 0; i < stringCount; i++) {
    const x = (i * stringMargin) + xMargin;
    const y1 = yMargin;
    const y2 = yMargin + neckHeight;
    const line = makeLine(x, y1, x, y2);
    elem.appendChild(line);
  }
}

function drawFrets(elem: SVGElement, state: FretboardState) {
  const {width, xMargin, yMargin, fretCount, fretHeight} = state;

  for (let i = 0; i <= fretCount; i++) {
    const y = (i * fretHeight) + yMargin;
    const x1 = xMargin;
    const x2 = width - xMargin;
    const line = makeLine(x1, y, x2, y);
    elem.appendChild(line);
  }
}

function drawLabel(elem: SVGElement, state: FretboardState, label: string) {
  const {width, yMargin} = state;
  const x = width / 2;
  const y = yMargin - (yMargin / 2);
  const textElem = makeText(x, y, label);
  elem.appendChild(textElem);
}

function drawFretNums(elem: SVGElement, state: FretboardState) {
  const {stringCount: string, startFret, endFret, fretHeight, fretNumOffset} = state;
  const fontSize = 16; // TODO: adjust this for different diagram sizes

  for (let fret = startFret; fret <= endFret; fret++) {
    const point = fretCoordPoint({fret, string}, state);
    const x = point.x - fretNumOffset;
    const y = point.y + (fretHeight / 4);
    const textElem = makeText(x, y, fret.toString(), fontSize);
    elem.appendChild(textElem);
  }
}

function drawDot(elem: SVGElement, state: FretboardState, dot: Dot) {
  const {dotColor, dotRadius} = state;
  const {x, y} = fretCoordPoint(dot, state);

  const color = dot.color || dotColor;
  const dotScale = dot.fret === 0 ? 0.66 : 1; // open string dots will be a little smaller
  const radius = dotRadius * dotScale;
  const cy = y + (radius / 2);

  const circle = makeCircle(x, cy, radius, color);
  elem.appendChild(circle);
}

function drawDots(elem: SVGElement, state: FretboardState, dots: Dot[]) {
  dots.forEach(dot => drawDot(elem, state, dot));
}

/**
 * Takes a FretCoord and returns the Point relative to the top left of the parent svg container.
 */
function fretCoordPoint(fretCoord: FretCoord, state: FretboardState) {
  const {string, fret} = fretCoord;
  const {xMargin, yMargin, stringCount, stringMargin, fretHeight} = state;

  const stringNum = Math.abs(string - stringCount);
  const x = (stringNum * stringMargin) + xMargin;
  const yOffset = fret === 0 ? 0 : -fretHeight / 8;
  const y = (fret * fretHeight) - (fretHeight / 2) + yMargin + yOffset;

  return {x, y};
}

/**
 * Returns the svg coordinate (x,y) of the `event`, i.e., the coordinate that was clicked.
 */
function cursorPoint(elem: SVGSVGElement, event: MouseEvent): Point {
  const point = elem.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;

  const screenCTM = elem.getScreenCTM();
  if (!screenCTM) throw new Error(`could not get the screen ctm of ${elem}`);

  const matrix = screenCTM.inverse();
  return point.matrixTransform(matrix);
}

/**
 * Find the closest FretCoord to the clicked point.
 */
function closestFretCoord(elem: SVGSVGElement, state: FretboardState, event: MouseEvent): FretCoord {
  const {xMargin, yMargin, stringMargin, fretHeight, stringCount} = state;
  const point = cursorPoint(elem, event);
  const x = point.x - xMargin;
  const y = point.y - yMargin + (fretHeight / 2);

  const string = Math.abs(Math.round(x / stringMargin) - stringCount);
  const fret = Math.round(y / fretHeight);
  return {string, fret};
}
