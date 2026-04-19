declare abstract class BaseChart {
  /** @internal */
  protected element: HTMLElement;
  /** Destroys the chart instance and cleans up DOM resources. */
  destroy(): void;
  /** Returns the unique identifier for this chart instance. */
  getInstanceId(): string;
}
/** @internal */
declare class ChartContext {
  constructor(element: HTMLElement, instanceId?: string);
  isShadowDOM(): boolean;
  getInstanceId(): string;
  destroy(): void;
}
/** @internal */
declare class G extends WrappedEl {}
/** @internal */
declare class SvgCanvas {}
/** @internal */
declare class WrappedEl {}






/** Options for WCAG 2.1 AA accessibility support */
export declare interface A11yOptions {
    readonly a11y?: {
        /** Whether accessibility features are enabled. Default: true */
        readonly enabled?: boolean;
        /** Overrides the auto-generated aria-label on the SVG root */
        readonly diagramLabel?: string;
        /** Populates the <desc> element for a longer optional description */
        readonly description?: string;
    };
}

/** Options for entrance animation */
export declare interface AnimationOptions {
    readonly animation: {
        /** Whether entrance animation is enabled. Automatically disabled when prefers-reduced-motion is set. Default: true */
        readonly enabled: boolean;
        /** Total duration of the animation in milliseconds. Default: 800 */
        readonly duration: number;
    };
}

declare class ApexSankey extends BaseChart {
    graph: SankeyGraphRenderer;
    options: SankeyOptions;
    /**
     * Create a new ApexSankey instance.
     *
     * Dimensions are applied to the host element immediately. Call `render()` to
     * build the SVG diagram after construction.
     *
     * @param element - The `HTMLElement` that will contain the Sankey SVG.
     * @param options - Partial `SankeyOptions` to override defaults. Any omitted
     *   field falls back to its default value (see `DefaultOptions`).
     *
     * @example
     * ```ts
     * import { ApexSankey } from 'apexsankey';
     * const sankey = new ApexSankey(document.getElementById('chart')!, {
     *   width: 800,
     *   height: 500,
     * });
     * ```
     */
    constructor(element: HTMLElement, options?: Partial<SankeyOptions>);
    /**
     * Set the global ApexCharts license key.
     *
     * Call this once before creating any chart instance, typically at app startup.
     * Without a valid license the chart renders with a watermark.
     *
     * @param key - The license key string provided by ApexCharts.
     *
     * @example
     * ```ts
     * import { ApexSankey } from 'apexsankey';
     * ApexSankey.setLicense('YOUR_LICENSE_KEY');
     * ```
     */
    static setLicense(key: string): void;
    private setupElementDimensions;
    private handleWatermark;
    /**
     * Render the Sankey diagram into the element supplied in the constructor.
     *
     * Constructs the internal graph layout and writes the SVG to the DOM.
     * If `options.enableToolbar` is `true`, the export toolbar is also rendered.
     *
     * @param data - A `GraphData` object containing three fields:
     *   - `nodes` — array of `{ id, title }` objects representing each entity.
     *   - `edges` — array of `{ source, target, value, type }` objects representing
     *     flow connections between nodes. `value` determines link width.
     *   - `options` — the full resolved `SankeyOptions` for this render.
     * @returns The internal `SankeyGraphRenderer` instance, which exposes `exportToSvg()`
     *   for programmatic SVG export after render.
     *
     * @throws {Error} If the container element is not found.
     *
     * @example
     * ```ts
     * sankey.render({
     *   nodes: [
     *     { id: 'a', title: 'Source A' },
     *     { id: 'b', title: 'Target B' },
     *   ],
     *   edges: [
     *     { source: 'a', target: 'b', value: 42, type: 'flow' },
     *   ],
     *   options: sankey.options,
     * });
     * ```
     */
    render(data: GraphData): SankeyGraphRenderer;
}
export { ApexSankey }
export default ApexSankey;

/**
 * Layout, canvas, and general behaviour options for the Sankey diagram.
 *
 * Controls canvas dimensions, column spacing, the zoom/pan toolbar, and the
 * internal SVG viewport. Compose with the other sub-option interfaces via
 * `SankeyOptions`.
 */
export declare interface CommonOptions {
    /** Arbitrary CSS injected onto the SVG root container element. */
    readonly canvasStyle: string;
    /** Show the zoom/pan toolbar. @default true */
    readonly enableToolbar: boolean;
    /** Height of the canvas. Use `'auto'` to derive height from width at a 1.6:1 ratio. @default 'auto' */
    readonly height: number | string;
    /** Horizontal spacing between node columns in pixels. @default 20 */
    readonly spacing: number;
    /** Internal SVG viewport height in pixels. @default 500 */
    readonly viewPortHeight: number;
    /** Internal SVG viewport width in pixels. @default 800 */
    readonly viewPortWidth: number;
    /** Width of the canvas. Accepts a pixel number or CSS percentage string. @default '100%' */
    readonly width: number | string;
}

/** Label attached to a graph edge during the layout pipeline */
declare interface EdgeLabel {
    value?: number;
    dy?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    d0?: string;
    d1?: string;
    r0?: number;
    r1?: number;
    Rmax?: number;
    points?: EdgePoint[];
    data?: Record<string, unknown> | null;
    origEdge?: GraphEdge;
    origLabel?: EdgeLabel;
    source?: NodeLabel;
    target?: NodeLabel;
    delta?: number;
    temp?: boolean;
    reversed?: boolean;
    reverse?: boolean;
    id?: string;
}

/**
 * Visual options for the curved flow bands (edges) between nodes.
 *
 * Controls opacity, gradient fill, and the gap between adjacent edges
 * at each node connection point.
 */
export declare interface EdgeOptions {
    /** Gap in pixels between adjacent edges at their node connection points. @default 2 */
    readonly edgeGap: number;
    /** When true, edges are filled with a gradient between source and target node colors. @default true */
    readonly edgeGradientFill: boolean;
    /** Opacity of edges (0–1). @default 0.4 */
    readonly edgeOpacity: number;
}

/** A single waypoint along an edge path */
declare interface EdgePoint {
    d?: string;
    ro?: number;
    ri?: number;
    r0?: number;
    r1?: number;
    x?: number;
    y?: number;
    style?: string;
}

/**
 * Typography options for the node label text.
 *
 * These map directly to CSS font properties. Applied to all node labels;
 * per-node overrides are not currently supported.
 */
export declare interface FontOptions {
    /** CSS color for node labels. @default '#212121' */
    readonly fontColor: string;
    /** CSS font-family for node labels. Falls back to the page default when empty. */
    readonly fontFamily: string;
    /** CSS font-size for node labels, e.g. `'14px'`. @default '14px' */
    readonly fontSize: string;
    /** CSS font-weight for node labels. @default '400' */
    readonly fontWeight: string;
}

/**
 * Input data object passed to `ApexSankey.render()`.
 *
 * @example
 * ```ts
 * sankey.render({
 *   nodes: [
 *     { id: 'a', title: 'Source A' },
 *     { id: 'b', title: 'Target B' },
 *   ],
 *   edges: [
 *     { source: 'a', target: 'b', value: 42, type: 'revenue' },
 *   ],
 *   options: sankey.options,
 * });
 * ```
 */
export declare interface GraphData {
    /** Array of edges (flows) connecting nodes. */
    readonly edges: SankeyGraphEdge[];
    /** Array of nodes (entities) in the diagram. */
    readonly nodes: SankeyGraphNode[];
    /** Resolved `SankeyOptions` for this render pass. Typically `sankey.options`. */
    readonly options: SankeyOptions;
}

/**
 * Shared structural types for the Sankey layout pipeline.
 * These mirror the subset of Graph methods used across layout modules.
 */
declare interface GraphEdge {
    v: string;
    w: string;
    name?: string;
}

/** Options for connected path highlighting on hover */
export declare interface InteractionOptions {
    /** When true, hovering a node or edge highlights the connected flow path. Default: true */
    readonly highlightConnectedPath: boolean;
    /** Opacity for dimmed (unrelated) elements when path highlighting is active. Default: 0.15 */
    readonly dimOpacity: number;
}

/**
 * Controls how much vertical whitespace is distributed between node rectangles.
 *
 * Lower `whitespace` values produce taller, more compact nodes; higher values
 * add more padding between them.
 */
export declare interface LayoutOptions {
    /** Fraction of vertical space used as margins between nodes (0–1). Lower values produce taller nodes. @default 0.18 */
    readonly whitespace: number;
}

/** Shape of node user data attached to a graph node */
export declare interface NodeData {
    id?: string;
    title?: string;
    color?: string;
    direction?: string;
    forceY?: number;
}

/** Label attached to a graph node during the layout pipeline */
declare interface NodeLabel {
    rank?: number;
    value?: number;
    dy?: number;
    y?: number;
    x?: number;
    id?: string;
    direction?: string;
    dummy?: boolean;
    spaceAbove?: number;
    spaceBelow?: number;
    data?: NodeData | null;
    incoming?: GraphEdge[];
    outgoing?: GraphEdge[];
    nodes?: string[];
    type?: string;
    depth?: number;
    thread?: string;
}

/**
 * Visual options for the node rectangles.
 *
 * Controls node width, border, and the `onNodeClick` callback.
 * Node colors are derived from the palette by default; override per-node
 * by setting `color` on the `SankeyGraphNode`.
 */
export declare interface NodeOptions {
    /** CSS color for the node border. Set to `null` to disable. @default null */
    readonly nodeBorderColor: string | null;
    /** Border width of each node in pixels. @default 1 */
    readonly nodeBorderWidth: number;
    /** Width of each node rectangle in pixels. @default 20 */
    readonly nodeWidth: number;
    /** Callback fired when the user clicks a node. Receives a `SankeyNode` object. */
    readonly onNodeClick?: (node: SankeyNode) => void;
}

/** Data passed to the nodeTooltipTemplate callback */
export declare interface NodeTooltipContent {
    node?: NodeData | null;
    value?: number;
}

declare class Paper {
    element: HTMLElement;
    options: SankeyOptions;
    protected chartContext: ChartContext;
    canvas: SvgCanvas;
    constructor(element: HTMLElement, options: SankeyOptions, chartContext: ChartContext);
    private getYShift;
    add(element: WrappedEl): void;
    clear(): void;
    exportToSvg(): void;
    resetViewBox(): void;
    updateViewBox(x: number, y: number, width: number, height: number): void;
    get height(): number;
    get spacing(): number;
    get width(): number;
}

/** Generic graph interface for layout algorithms that only need basic traversal. */
declare interface SankeyGraph {
    nodes(): string[];
    node(id: string): NodeLabel;
    setNode(id: string, label: NodeLabel): void;
    edges(): GraphEdge[];
    edge(e: GraphEdge | string): EdgeLabel;
    edge(v: string, w: string, name?: string): EdgeLabel;
    setEdge(v: string, w: string, label: EdgeLabel, name?: string): void;
    setEdge(e: GraphEdge, label: EdgeLabel): void;
    removeEdge(e: GraphEdge): void;
    removeNode(id: string): void;
    hasEdge(v: string, w: string): boolean;
    hasNode(id: string): boolean;
    inEdges(id: string): GraphEdge[];
    outEdges(id: string): GraphEdge[];
    nodeEdges(u: string, v: string): GraphEdge[];
    sources(): string[];
    successors(id: string): string[];
    setGraph(label: unknown): void;
}

/**
 * A single edge (flow) between two nodes in the Sankey diagram.
 *
 * Edges are rendered as curved bands whose width is proportional to `value`.
 */
export declare interface SankeyGraphEdge {
    /** `id` of the source (upstream) node. */
    readonly source: string;
    /** `id` of the target (downstream) node. */
    readonly target: string;
    /** Category label for this edge. Used for grouping and tooltip display. */
    readonly type: string;
    /** Numeric flow value. Determines the visual width of the edge band. */
    readonly value: number;
}

/**
 * A single node (entity) in the Sankey diagram.
 *
 * Nodes are rendered as vertical rectangles. Use `color` to override
 * the auto-assigned palette color for this node.
 */
export declare interface SankeyGraphNode {
    /** Override the auto-assigned fill color for this node rectangle. */
    readonly color?: string;
    /** Unique identifier for this node. Referenced by `Edge.source` and `Edge.target`. */
    readonly id: string;
    /** Display label rendered beside or inside the node. */
    readonly title: string;
}

declare class SankeyGraphRenderer extends Paper {
    graph: SankeyGraph;
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

/** Data passed to the onNodeClick callback */
export declare interface SankeyNode {
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

/**
 * Full configuration type for `ApexSankey`. An intersection of all sub-option
 * interfaces: `CommonOptions & EdgeOptions & FontOptions & InteractionOptions &
 * AnimationOptions & LayoutOptions & NodeOptions & TooltipOptions & A11yOptions`.
 *
 * Pass a `Partial<SankeyOptions>` to the constructor — all fields have defaults.
 */
export declare type SankeyOptions = CommonOptions & EdgeOptions & FontOptions & InteractionOptions & AnimationOptions & LayoutOptions & NodeOptions & TooltipOptions & A11yOptions;

/** Data passed to the tooltipTemplate callback */
export declare interface TooltipContent {
    source?: NodeData | null;
    target?: NodeData | null;
    value?: number;
}

/**
 * Options for the hover tooltip shown over edges and nodes.
 *
 * Show/hide independently for edges (`enableTooltip`) and supply custom
 * `tooltipTemplate` / `nodeTooltipTemplate` functions to render arbitrary HTML.
 * Use `tooltipTheme` as a shortcut for dark/light color presets.
 */
export declare interface TooltipOptions {
    /** Show edge tooltips on hover. @default true */
    readonly enableTooltip: boolean;
    /** Background color of the tooltip. @default '#FFFFFF' */
    readonly tooltipBGColor: string;
    /** Border color of the tooltip. @default '#E2E8F0' */
    readonly tooltipBorderColor: string;
    /** Font color inside the tooltip. @default '#1a1a1a' */
    readonly tooltipFontColor: string;
    /** HTML `id` for the tooltip container element. @default 'apexsankey-tooltip-container' */
    readonly tooltipId: string;
    /** `'light'` | `'dark'` — overrides `tooltipBGColor`/`tooltipBorderColor`/`tooltipFontColor` with built-in presets. */
    readonly tooltipTheme?: 'dark' | 'light';
    /** Custom function returning an HTML string for the edge (source→target) tooltip. */
    readonly tooltipTemplate?: (content: TooltipContent) => string;
    /** Custom function returning an HTML string for the per-node tooltip. */
    readonly nodeTooltipTemplate?: (content: NodeTooltipContent) => string;
}

export { }
