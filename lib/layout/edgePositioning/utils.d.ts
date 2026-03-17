import { EdgeLabel, SankeyGraph } from '../types';

export declare function findFirst(links: EdgeLabel[], p: (link: EdgeLabel) => boolean): number | null;
/**
 * Adjust radii of curvature to avoid overlaps, as much as possible.
 * @param links - the list of links, ordered from outside to inside of bend
 * @param rr - "r0" or "r1", the side to work on
 */
export declare function sweepCurvatureInwards(links: EdgeLabel[], rr: 'r0' | 'r1'): void;
export declare function addLinkEndpoints(G: SankeyGraph): void;
