import { Paper } from './Paper';
import { SankeyOptions } from './Options';
import { Graph } from 'graphlib';
import { G } from '@svgdotjs/svg.js';
import { ChartContext } from '../../../../graph-utils/src/index.ts';

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
    graph: Graph;
    maxRank: number;
    constructor(element: HTMLElement, options: SankeyOptions, chartContext: ChartContext);
    construct(data: GraphData): void;
    render({ keepOldPosition }?: {
        keepOldPosition?: boolean;
    }): void;
    renderEdge(edgeObj: any, group: G): void;
}
