import { SankeyOptions } from './Options';
import { Element, Svg } from '@svgdotjs/svg.js';
import { ChartContext } from '../../../../graph-utils/src/index.ts';

export declare class Paper {
    element: HTMLElement;
    options: SankeyOptions;
    protected chartContext: ChartContext;
    canvas: Svg;
    constructor(element: HTMLElement, options: SankeyOptions, chartContext: ChartContext);
    private getYShift;
    add(element: Element): void;
    clear(): void;
    exportToSvg(): void;
    resetViewBox(): void;
    updateViewBox(x: number, y: number, width: number, height: number): void;
    get height(): number;
    get spacing(): number;
    get width(): number;
}
