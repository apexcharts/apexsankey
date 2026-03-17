/**
 * Original, full-width node positioning.
 *
 * Uses spacing and whitespace fraction to position nodes within layers.
 *
 * @module node-positioning/justified
 */
/** Shape of the mutable node object the layout algorithm reads and writes */
export interface LayoutNode {
    value: number;
    dy: number;
    y: number;
    x: number;
    id: string;
    spaceAbove: number;
    spaceBelow: number;
    direction?: string;
    data?: {
        direction?: string;
        forceY?: number;
    };
}
/** Shape of the mutable edge object the layout algorithm reads and writes */
interface LayoutEdge {
    data: {
        value: number;
    };
    value: number;
    dy: number;
}
/** Minimal structural interface for the graph object used by the layout algorithms */
export interface LayoutGraph {
    nodes(): string[];
    node(id: string): LayoutNode;
    setNode(id: string, label: LayoutNode): void;
    inEdges(id: string): Array<{
        v: string;
        w: string;
    }>;
    outEdges(id: string): Array<{
        v: string;
        w: string;
    }>;
    edges(): Array<{
        v: string;
        w: string;
    }>;
    edge(e: {
        v: string;
        w: string;
    }): LayoutEdge;
}
type NodeId = string;
type SeparationFn = (a: NodeId, b: NodeId, G: LayoutGraph) => number;
export declare function justifiedPositioning(): {
    (G: LayoutGraph, order: NodeId[][][], edgeGap?: number): LayoutNode[];
    scaleToFit(G: LayoutGraph, order: NodeId[][][], edgeGap?: number): void;
    size(x?: number[]): number[] | any;
    separation(x?: SeparationFn | number): SeparationFn | any;
    whitespace(x?: number): number | any;
    scale(x?: number): number | any | null;
};
export {};
