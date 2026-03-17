export interface GraphOptions {
    directed?: boolean;
    multigraph?: boolean;
}
export interface EdgeObj {
    v: string;
    w: string;
    name?: string;
}
export declare class Graph {
    private _nodes;
    private _edges;
    private _graphLabel;
    private _out;
    private _in;
    private _isMultigraph;
    constructor(opts?: GraphOptions);
    graph(): unknown;
    setGraph(label: unknown): this;
    setNode(id: string, label?: unknown): this;
    node(id: string): unknown;
    hasNode(id: string): boolean;
    nodes(): string[];
    removeNode(id: string): this;
    sources(): string[];
    successors(v: string): string[];
    setEdge(vOrEdge: string | EdgeObj, wOrLabel?: unknown, label?: unknown, name?: string): this;
    edge(eOrV: EdgeObj | string, w?: string, name?: string): unknown;
    hasEdge(v: string, w: string, name?: string): boolean;
    edges(): EdgeObj[];
    removeEdge(e: EdgeObj): this;
    outEdges(v: string): EdgeObj[];
    inEdges(v: string): EdgeObj[];
    nodeEdges(a: string, b: string): EdgeObj[];
}
