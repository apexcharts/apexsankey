import { SankeyGraph as SankeyGraphLayout } from '../layout/types';

/**
 * Highlights the connected flow path when hovering a node or edge in the Sankey diagram.
 * Dims unrelated elements and brightens the hovered element and its connected chain.
 * Respects `prefers-reduced-motion` by skipping opacity transitions when active.
 */
export declare class PathHighlighter {
    private readonly svgRoot;
    private readonly graph;
    private readonly dimOpacity;
    constructor(svgRoot: SVGElement, graph: SankeyGraphLayout, dimOpacity: number);
    /**
     * Dims all unrelated elements and highlights the given node plus all directly
     * connected edges and nodes (one hop away).
     */
    highlightNode(nodeId: string): void;
    /**
     * Dims all unrelated elements and highlights the hovered edge along with its
     * real source and target nodes.
     */
    highlightEdge(sourceId: string, targetId: string): void;
    /** Restores all edges and nodes to their original (pre-highlight) opacity. */
    reset(): void;
    private dimAll;
    private setOpacity;
    private prefersReducedMotion;
}
