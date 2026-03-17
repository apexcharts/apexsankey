import { SankeyGraph } from '../types';

export declare function medianValue(positions: number[]): number;
export declare function sortNodes(G: SankeyGraph, order: string[][], sweepDirection?: number, includeLoops?: boolean): void;
export declare function neighbourPositions(G: SankeyGraph, order: string[][], i: number, j: number, u: string, includeLoops?: boolean): number[];
/**
 * Sort arr according to order. -1 in order means stay in same position.
 */
export declare function sortByPositions(arr: string[], order: Map<string, number>): void;
