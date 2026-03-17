import { Paper } from './Paper';
import { SankeyOptions } from './Options';
import { GraphEdge, SankeyGraph as SankeyGraphLayout } from '../layout/types';
import { ChartContext, G } from '../../../../graph-utils/src/index.ts';

export interface GraphPoint {
    readonly x: number;
    readonly y: number;
}
export interface Node {
    readonly color?: string;
    readonly id: string;
    readonly title: string;
}
export interface Edge {
    readonly source: string;
    readonly target: string;
    readonly type: string;
    readonly value: number;
}
export interface GraphData {
    readonly edges: Edge[];
    readonly nodes: Node[];
    readonly options: SankeyOptions;
}
export declare class SankeyGraph extends Paper {
    graph: SankeyGraphLayout;
    maxRank: number;
    /** Options resolved with CSS custom property overrides for the current render pass. */
    private renderOptions;
    /** Accessibility helper — re-created on each render pass. */
    private a11yHelper;
    /** Path highlighter — re-created on each render pass when feature is enabled. */
    private pathHighlighter;
    /** Guard: entrance animation plays only on the first render. */
    private _hasAnimated;
    constructor(element: HTMLElement, options: SankeyOptions, chartContext: ChartContext);
    construct(data: GraphData): void;
    render({ keepOldPosition }?: {
        keepOldPosition?: boolean | undefined;
    }): void;
    renderEdge(edgeObj: GraphEdge, group: G): void;
}
