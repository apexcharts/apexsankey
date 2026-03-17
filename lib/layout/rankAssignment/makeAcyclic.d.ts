import { SankeyGraph } from '../types';

/**
 * Reverse edges in G to make it acyclic
 */
export declare function makeAcyclic(G: SankeyGraph, v0: string): SankeyGraph;
export declare function findSpanningTree(G: SankeyGraph, v0: string): SankeyGraph;
/**
 * Returns 1 if w is a descendent of v, -1 if v is a descendent of w, and 0 if
 * they are unrelated.
 */
export declare function nodeRelationship(tree: SankeyGraph, v: string, w: string): number;
