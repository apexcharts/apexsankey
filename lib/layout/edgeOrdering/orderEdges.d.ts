/** @module edge-ordering */
/**
 * Assign incoming and outgoing edge lists to each node.
 *
 * The actual sorting of edges for smooth flow is handled in linkLayout.ts
 * where edges are sorted by connected node y-position before endpoint assignment.
 *
 * @param {Graph} G - The graph. Nodes must have `x` and `y` attributes.
 *
 */
export declare function orderEdges(G: any, { alignLinkTypes }?: {
    alignLinkTypes?: boolean;
}): void;
