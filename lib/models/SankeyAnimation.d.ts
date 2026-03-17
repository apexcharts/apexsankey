/**
 * Plays a left-to-right entrance animation on the Sankey chart using the Web Animations API.
 *
 * Two things happen simultaneously:
 *  1. A clipPath rect sweeps left → right via rAF-driven setAttribute (WAAPI cannot animate
 *     SVG presentation attributes directly — the `width` keyframe is rejected in all browsers).
 *  2. Each node column fades + slides in, staggered by rank so earlier columns appear first.
 *     Nodes start hidden via inline style so there is no flicker before the delay fires.
 *
 * Respects `prefers-reduced-motion`: skipped entirely when the media query matches.
 */
export declare function playSankeyAnimation(svgEl: SVGSVGElement, edgesGroup: SVGElement, nodesGroup: SVGElement, maxRank: number, duration: number): void;
