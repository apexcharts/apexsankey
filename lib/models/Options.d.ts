import { NodeData } from '../layout/types';

/** Options for WCAG 2.1 AA accessibility support */
export interface A11yOptions {
    readonly a11y?: {
        /** Whether accessibility features are enabled. Default: true */
        readonly enabled?: boolean;
        /** Overrides the auto-generated aria-label on the SVG root */
        readonly diagramLabel?: string;
        /** Populates the <desc> element for a longer optional description */
        readonly description?: string;
    };
}
/** Data passed to the onNodeClick callback */
export interface SankeyNode {
    value?: number;
    dy?: number;
    y?: number;
    x?: number;
    rank?: number;
    spaceAbove?: number;
    spaceBelow?: number;
    direction?: string;
    data?: NodeData | null;
}
/** Data passed to the tooltipTemplate callback */
export interface TooltipContent {
    source?: NodeData | null;
    target?: NodeData | null;
    value?: number;
}
/** Data passed to the nodeTooltipTemplate callback */
export interface NodeTooltipContent {
    node?: NodeData | null;
    value?: number;
}
export interface CommonOptions {
    readonly canvasStyle: string;
    readonly enableToolbar: boolean;
    readonly height: number | string;
    readonly spacing: number;
    readonly viewPortHeight: number;
    readonly viewPortWidth: number;
    readonly width: number | string;
}
export interface NodeOptions {
    readonly nodeBorderColor: string | null;
    readonly nodeBorderWidth: number;
    readonly nodeWidth: number;
    readonly onNodeClick?: (node: SankeyNode) => void;
}
export interface EdgeOptions {
    readonly edgeGap: number;
    readonly edgeGradientFill: boolean;
    readonly edgeOpacity: number;
}
export interface LayoutOptions {
    readonly whitespace: number;
}
export interface FontOptions {
    readonly fontColor: string;
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly fontWeight: string;
}
export interface TooltipOptions {
    readonly enableTooltip: boolean;
    readonly tooltipBGColor: string;
    readonly tooltipBorderColor: string;
    readonly tooltipFontColor: string;
    readonly tooltipId: string;
    /** 'light' | 'dark' — overrides tooltipBGColor/tooltipBorderColor/tooltipFontColor with built-in presets */
    readonly tooltipTheme?: 'dark' | 'light';
    readonly tooltipTemplate?: (content: TooltipContent) => string;
    readonly nodeTooltipTemplate?: (content: NodeTooltipContent) => string;
}
/** Options for connected path highlighting on hover */
export interface InteractionOptions {
    /** When true, hovering a node or edge highlights the connected flow path. Default: true */
    readonly highlightConnectedPath: boolean;
    /** Opacity for dimmed (unrelated) elements when path highlighting is active. Default: 0.15 */
    readonly dimOpacity: number;
}
/** Options for entrance animation */
export interface AnimationOptions {
    readonly animation: {
        /** Whether entrance animation is enabled. Automatically disabled when prefers-reduced-motion is set. Default: true */
        readonly enabled: boolean;
        /** Total duration of the animation in milliseconds. Default: 800 */
        readonly duration: number;
    };
}
export type SankeyOptions = CommonOptions & EdgeOptions & FontOptions & InteractionOptions & AnimationOptions & LayoutOptions & NodeOptions & TooltipOptions & A11yOptions;
export declare const DefaultOptions: SankeyOptions;
