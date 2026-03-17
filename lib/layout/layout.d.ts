import { EdgeLabel, RankSet, SankeyGraph } from './types';
import { LayoutGraph, LayoutNode } from './nodePositioning/justified';
import { SankeyOptions } from '../models/Options';

/** Data passed to the layout function for controlling graph layout */
interface LayoutData {
    order?: string[][][] | string[][];
    rankSets?: RankSet[];
    alignLinkTypes?: boolean;
}
/** Input edge data shape (from user-provided graph data) */
interface InputEdge {
    source: string;
    target: string;
    type: string;
}
/** Input node data shape (from user-provided graph data) */
interface InputNode {
    id: string;
    direction?: string;
}
/**
 * Sankey layout
 * @constructor sankey
 */
export declare function sankey(options: Partial<SankeyOptions>): {
    (linksIn?: InputEdge[], nodesIn?: InputNode[], data?: LayoutData): SankeyGraph;
    nodes(): LayoutNode[];
    links(): EdgeLabel[];
    order(): string[][] | string[][][] | null;
    /**
     * Set size of layout.
     * @method size
     * @param size {[width, height]} - size
     * @returns {sankeyLayout|Number[]}
     */
    size(x?: number[]): number[] | {
        (G: LayoutGraph, order: string[][][], edgeGap?: number): LayoutNode[];
        scaleToFit(G: LayoutGraph, order: string[][][], edgeGap?: number): void;
        size(x?: number[] | undefined): number[] | any;
        separation(x?: number | ((a: string, b: string, G: LayoutGraph) => number) | undefined): ((a: string, b: string, G: LayoutGraph) => number) | any;
        whitespace(x?: number | undefined): number | any;
        scale(x?: number | undefined): number | any | null;
    } | any;
    separation(x?: number): ((a: string, b: string, G: LayoutGraph) => number) | {
        (G: LayoutGraph, order: string[][][], edgeGap?: number): LayoutNode[];
        scaleToFit(G: LayoutGraph, order: string[][][], edgeGap?: number): void;
        size(x?: number[] | undefined): number[] | any;
        separation(x?: number | ((a: string, b: string, G: LayoutGraph) => number) | undefined): ((a: string, b: string, G: LayoutGraph) => number) | any;
        whitespace(x?: number | undefined): number | any;
        scale(x?: number | undefined): number | any | null;
    } | any;
    whitespace(x?: number): number | {
        (G: LayoutGraph, order: string[][][], edgeGap?: number): LayoutNode[];
        scaleToFit(G: LayoutGraph, order: string[][][], edgeGap?: number): void;
        size(x?: number[] | undefined): number[] | any;
        separation(x?: number | ((a: string, b: string, G: LayoutGraph) => number) | undefined): ((a: string, b: string, G: LayoutGraph) => number) | any;
        whitespace(x?: number | undefined): number | any;
        scale(x?: number | undefined): number | any | null;
    } | any;
    edgeValue(_x?: unknown): any;
    scale(x?: number): number | {
        (G: LayoutGraph, order: string[][][], edgeGap?: number): LayoutNode[];
        scaleToFit(G: LayoutGraph, order: string[][][], edgeGap?: number): void;
        size(x?: number[] | undefined): number[] | any;
        separation(x?: number | ((a: string, b: string, G: LayoutGraph) => number) | undefined): ((a: string, b: string, G: LayoutGraph) => number) | any;
        whitespace(x?: number | undefined): number | any;
        scale(x?: number | undefined): number | any | null;
    } | any | null;
};
export {};
