import { RankSet, SankeyGraph } from '../types';

/**
 * Assign ranks to the nodes in graph, according to rankSets.
 */
export declare function assignRanks(graph: SankeyGraph, rankSets: RankSet[]): void;
