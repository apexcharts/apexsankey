import { FontOptions, NodeOptions, NodeTooltipContent } from './Options';
import { NodeLabel } from '../layout/types';
import { G, ChartContext } from '../../../../graph-utils/src/index.ts';

export interface NodeTooltipOptions {
    chartContext: ChartContext;
    nodeValue: number;
    tooltipBGColor: string;
    tooltipBorderColor: string;
    tooltipFontColor: string;
    tooltipId: string;
    nodeTooltipTemplate: (content: NodeTooltipContent) => string;
}
export declare function renderNode(graphNode: NodeLabel, maxRank: number, options: Partial<FontOptions & NodeOptions & {
    nodeTooltip?: NodeTooltipOptions;
}>): G;
