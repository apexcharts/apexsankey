import { SankeyOptions } from './models/Options';
import { GraphData, SankeyGraph } from './models/Graph';
import { BaseChart } from '../../../graph-utils/src/index.ts';

export declare class ApexSankey extends BaseChart {
    graph: SankeyGraph;
    options: SankeyOptions;
    constructor(element: HTMLElement, options?: Partial<SankeyOptions>);
    static setLicense(key: string): void;
    private setupElementDimensions;
    private handleWatermark;
    render(data: GraphData): SankeyGraph;
}
