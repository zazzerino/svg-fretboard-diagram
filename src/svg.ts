import {Point} from "./types";

/**
 * The svg namespace. Needed to create svg elements.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Calculates the distance between two points. Credit to Euclid.
 */
export function distanceBetween(pt1: Point, pt2: Point): number {
  const x = pt2.x - pt1.x;
  const y = pt2.y - pt1.y;
  return Math.hypot(x, y);
}

/**
 * Create an svg element with the given width and height.
 */
export function makeSvgElement(width: number, height: number, className?: string): SVGSVGElement {
  const elem = document.createElementNS(SVG_NS, 'svg');
  elem.setAttribute('width', width.toString());
  elem.setAttribute('height', height.toString());
  elem.setAttribute('viewBox', `0 0 ${width} ${height}`);
  if (className) elem.classList.add(className);
  return elem;
}

/**
 * Create an svg line element from (x1,y1) to (x2,y2).
 */
export function makeLine(x1: number, y1: number, x2: number, y2: number, color = 'black'): SVGLineElement {
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', x1.toString());
  line.setAttribute('y1', y1.toString());
  line.setAttribute('x2', x2.toString());
  line.setAttribute('y2', y2.toString());
  line.setAttribute('stroke', color);
  return line;
}

/**
 * Create an svg circle element.
 * @param cx The center x coordinate.
 * @param cy The center y coordinate.
 * @param r The radius.
 * @param color The color that the circle will be filled in with.
 */
export function makeCircle(cx: number, cy: number, r: number, color = 'white'): SVGCircleElement {
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', cx.toString());
  circle.setAttribute('cy', cy.toString());
  circle.setAttribute('r', r.toString());
  circle.setAttribute('stroke', 'black');
  circle.setAttribute('fill', color);
  return circle;
}

/**
 * Create an svg text element.
 * (x,y) is the starting point of the text baseline.
 */
export function makeText(x: number, y: number, text: string, fontSize = 16): SVGTextElement {
  const textElem = document.createElementNS(SVG_NS, 'text');
  textElem.setAttribute('x', x.toString());
  textElem.setAttribute('y', y.toString());
  textElem.setAttribute('text-anchor', 'middle');
  textElem.setAttribute('font-size', fontSize.toString());

  const textNode = document.createTextNode(text);
  textElem.appendChild(textNode);

  return textElem;
}
