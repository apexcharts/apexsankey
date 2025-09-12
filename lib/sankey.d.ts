import { SankeyOptions } from './models/Options';
import { GraphData, SankeyGraph } from './models/Graph';

export declare class ApexSankey {
    element: HTMLElement;
    options: SankeyOptions;
    graph: SankeyGraph;
    constructor(element: HTMLElement, options: SankeyOptions);
    static setLicense(key: string): void;
    /**
     * Handle watermark display based on license validation
     */
    private handleWatermark;
    render(data: GraphData): SankeyGraph;
}
