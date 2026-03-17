import { LayoutGraph } from './justified';

export declare function spanMinWidths(G: LayoutGraph, order: string[][][]): number[];
export declare function positionHorizontally(G: LayoutGraph, order: string[][][], width: number, minWidths: number[]): void;
