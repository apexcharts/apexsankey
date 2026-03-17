import { SankeyGraph } from './types';

interface InputEdge {
    source: string;
    target: string;
    type: string;
}
interface InputNode {
    id: string;
    direction?: string;
}
export declare function createGraph(nodes?: InputNode[], edges?: InputEdge[]): SankeyGraph;
export {};
