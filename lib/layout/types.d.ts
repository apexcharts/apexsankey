/**
 * Shared structural types for the Sankey layout pipeline.
 * These mirror the subset of Graph methods used across layout modules.
 */
export interface GraphEdge {
    v: string;
    w: string;
    name?: string;
}
/** Shape of node user data attached to a graph node */
export interface NodeData {
    id?: string;
    title?: string;
    color?: string;
    direction?: string;
    forceY?: number;
}
/** A single waypoint along an edge path */
export interface EdgePoint {
    d?: string;
    ro?: number;
    ri?: number;
    r0?: number;
    r1?: number;
    x?: number;
    y?: number;
    style?: string;
}
/** Label attached to a graph node during the layout pipeline */
export interface NodeLabel {
    rank?: number;
    value?: number;
    dy?: number;
    y?: number;
    x?: number;
    id?: string;
    direction?: string;
    dummy?: boolean;
    spaceAbove?: number;
    spaceBelow?: number;
    data?: NodeData | null;
    incoming?: GraphEdge[];
    outgoing?: GraphEdge[];
    nodes?: string[];
    type?: string;
    depth?: number;
    thread?: string;
}
/** Label attached to a graph edge during the layout pipeline */
export interface EdgeLabel {
    value?: number;
    dy?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    d0?: string;
    d1?: string;
    r0?: number;
    r1?: number;
    Rmax?: number;
    points?: EdgePoint[];
    data?: Record<string, unknown> | null;
    origEdge?: GraphEdge;
    origLabel?: EdgeLabel;
    source?: NodeLabel;
    target?: NodeLabel;
    delta?: number;
    temp?: boolean;
    reversed?: boolean;
    reverse?: boolean;
    id?: string;
}
/** A rank set used to group nodes at the same rank level */
export interface RankSet {
    type: string;
    nodes?: string[];
}
/** Generic graph interface for layout algorithms that only need basic traversal. */
export interface SankeyGraph {
    nodes(): string[];
    node(id: string): NodeLabel;
    setNode(id: string, label: NodeLabel): void;
    edges(): GraphEdge[];
    edge(e: GraphEdge | string): EdgeLabel;
    edge(v: string, w: string, name?: string): EdgeLabel;
    setEdge(v: string, w: string, label: EdgeLabel, name?: string): void;
    setEdge(e: GraphEdge, label: EdgeLabel): void;
    removeEdge(e: GraphEdge): void;
    removeNode(id: string): void;
    hasEdge(v: string, w: string): boolean;
    hasNode(id: string): boolean;
    inEdges(id: string): GraphEdge[];
    outEdges(id: string): GraphEdge[];
    nodeEdges(u: string, v: string): GraphEdge[];
    sources(): string[];
    successors(id: string): string[];
    setGraph(label: unknown): void;
}
