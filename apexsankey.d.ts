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
declare class SvgCanvas {}
/** @internal */
declare class WrappedEl {}



declare type TextDirection = 'ltr' | 'rtl' | 'auto';



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

/** A `{ nodes, edges }` pair — the shape `render()`/`update()` consume, minus `options`. */
export declare interface AggregatedGraph {
    nodes: SankeyGraphNode[];
    edges: SankeyGraphEdge[];
}

/** The graph the builder produces: ready to pass straight to `render()`/`update()`. */
export declare interface AlluvialData {
    readonly nodes: SankeyGraphNode[];
    readonly edges: SankeyGraphEdge[];
}

/**
 * Alluvial-shaped input: an ordered list of dimensions (axes) and the records
 * (subjects) that flow across them. {@link buildAlluvialData} turns this into
 * the `{ nodes, edges }` the Sankey engine already renders.
 */
export declare interface AlluvialInput {
    /** Ordered dimension (axis) ids, left → right. */
    readonly dimensions: string[];
    /** The subjects flowing across the dimensions. */
    readonly records: AlluvialRecord[];
    /** Category color palette, cycled per distinct category. Defaults to the built-in palette. */
    readonly palette?: string[];
}

/**
 * One subject flowing across the alluvial dimensions: its category at each
 * dimension, and how much it contributes.
 */
export declare interface AlluvialRecord {
    /** Category label at each dimension, keyed by dimension id. Missing keys drop that adjacency. */
    readonly values: Record<string, string>;
    /** Weight this record contributes to each flow it participates in. @default 1 */
    readonly value?: number;
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
    /** Built-in plugin factories, for `use()`. Also importable as named exports. */
    static readonly plugins: {
        pathTrace: typeof pathTrace;
        timePlayback: typeof timePlayback;
        drillDown: typeof drillDown;
    };
    graph: SankeyGraphRenderer;
    options: SankeyOptions;
    /** Event bus backing the public `on`/`off`/`use` API. */
    private readonly events;
    /** Teardown functions from installed plugins, run on `destroy()`. */
    private readonly pluginTeardowns;
    /** Guards against a double `destroy()` (idempotent teardown). */
    private isDestroyed;
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
    /**
     * Register (or override) a named theme, then reference it by name via the
     * `theme` option. Use this for brand presets shared across an app.
     *
     * @param name - The name to register the theme under.
     * @param theme - The coordinated visual defaults. See {@link SankeyTheme}.
     *
     * @example
     * ```ts
     * ApexSankey.registerTheme('acme', {
     *   nodePalette: ['#ff5a5f', '#087f8c', '#5d2e8c'],
     *   fontColor: '#1a1a1a',
     *   canvasStyle: 'background: #faf7f2; box-sizing: border-box;',
     * });
     * const sankey = new ApexSankey(el, { theme: 'acme' });
     * ```
     */
    static registerTheme(name: string, theme: SankeyTheme): void;
    /**
     * Build the `{ nodes, edges }` for an alluvial diagram from categorical
     * records-across-dimensions (the same model `render()` takes). Combine with
     * the `axisTitles` option for the dimension labels. See {@link buildAlluvialData}.
     *
     * @example
     * ```ts
     * const data = ApexSankey.buildAlluvialData({
     *   dimensions: ['2019', '2022'],
     *   records: [{values: {'2019': 'Free', '2022': 'Pro'}}],
     * });
     * new ApexSankey(el, {axisTitles: ['2019', '2022']}).render({...data, options});
     * ```
     */
    static buildAlluvialData(input: AlluvialInput): AlluvialData;
    /**
     * Project a detailed `{ nodes, edges }` to an aggregated one by collapsing the
     * given `groups` (every id in `collapsed` becomes a single super-node; its
     * flows are re-routed and merged). The pure transform behind the `drillDown`
     * plugin, exposed so you can seed the initial collapsed render. See
     * {@link collapseGroups}.
     *
     * @example
     * ```ts
     * const detail = {nodes, edges};
     * const groups = [{id: 'Fossil', title: 'Fossil', children: ['Coal', 'Gas']}];
     * sankey.render({...ApexSankey.collapseGroups(detail, groups, ['Fossil']), options});
     * ```
     */
    static collapseGroups(data: AggregatedGraph, groups: DrillDownGroup[], collapsed: Iterable<string>): AggregatedGraph;
    /**
     * Render a side-by-side comparison of two Sankey diagrams (a "before" and an
     * "after") into `element`: two linked instances that outline each flow by how
     * it changed and highlight the same node across both panels on hover. Returns
     * the {@link SankeyComparison} handle (`before` / `after` / `diff` /
     * `destroy()`). See {@link SankeyComparison}.
     *
     * @example
     * ```ts
     * const cmp = ApexSankey.compare(el, {
     *   before: {nodes, edges: edges2024, title: '2024'},
     *   after: {nodes, edges: edges2025, title: '2025'},
     * });
     * ```
     */
    static compare(element: HTMLElement, config: ComparisonConfig): SankeyComparison;
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
    /**
     * Update the diagram to new data, animating the change when possible.
     *
     * Call this on an already-`render()`ed instance to transition to a new data
     * set. When the new layout shares the current topology (the same nodes and
     * flows, only different values/positions), the nodes and ribbons spring
     * smoothly to their new places. When the topology differs, animation is
     * disabled, or the user prefers reduced motion, it redraws instantly. The
     * public API and output are identical to `render()` at rest.
     *
     * @param data - The new `GraphData` to display.
     * @returns The internal `SankeyGraphRenderer` instance.
     *
     * @example
     * ```ts
     * sankey.render({ nodes, edges: edges2024, options: sankey.options });
     * // later, on the same instance:
     * sankey.update({ nodes, edges: edges2025, options: sankey.options });
     * ```
     */
    update(data: GraphData, transition?: SankeyTransition): SankeyGraphRenderer;
    /**
     * Subscribe to an instance event. Returns an unsubscribe function.
     *
     * Events: `node:click` / `node:mouseenter` / `node:mouseleave` and
     * `edge:click` / `edge:mouseenter` / `edge:mouseleave` (interaction),
     * `rendered` (after the initial render and after each `update()` settles),
     * and `destroyed`. See {@link SankeyEventMap} for payloads.
     *
     * @example
     * ```ts
     * const off = sankey.on('node:click', ({id}) => console.log(id));
     * // later: off();
     * ```
     */
    on<K extends SankeyEventName>(event: K, handler: (payload: SankeyEventMap[K]) => void): () => void;
    /** Remove a handler previously registered with {@link on}. */
    off<K extends SankeyEventName>(event: K, handler: (payload: SankeyEventMap[K]) => void): void;
    /**
     * Install a plugin. Its `install` runs immediately with a
     * {@link SankeyPluginContext}; any teardown it returns runs on `destroy()`.
     *
     * @example
     * ```ts
     * sankey.use({
     *   name: 'logger',
     *   install: ({on}) => on('node:click', ({id}) => console.log(id)),
     * });
     * ```
     */
    use(plugin: SankeyPlugin): this;
    /**
     * Tear down the chart: run plugin teardowns, emit `destroyed`, drop all event
     * handlers, then release the chart context (removes the tooltip element etc.).
     */
    destroy(): void;
}
export { ApexSankey }
export default ApexSankey;

/**
 * Transform alluvial records-across-dimensions into the Sankey `{ nodes, edges }`
 * model. One node is created per (dimension, category) that occurs, and one edge
 * per adjacent-dimension category transition, its value the summed record weight.
 *
 * A category keeps the *same color across every dimension*, so a cohort reads as
 * one continuous stream (and same-category transitions render as a solid band).
 * Node ids are opaque and DOM-safe; the category name is the node title.
 *
 * @example
 * ```ts
 * const data = buildAlluvialData({
 *   dimensions: ['2019', '2022'],
 *   records: [
 *     { values: {'2019': 'Free', '2022': 'Pro'} },
 *     { values: {'2019': 'Free', '2022': 'Free'} },
 *   ],
 * });
 * sankey.render({ ...data, options: sankey.options });
 * ```
 */
export declare function buildAlluvialData(input: AlluvialInput): AlluvialData;

/**
 * Project a detailed graph to an aggregated one by collapsing groups.
 *
 * `collapsed` lists the group ids to collapse; every other group renders
 * expanded (its children pass through untouched). For each collapsed group the
 * children are replaced by one super-node and their flows are re-routed to it:
 * flows between two members of the same collapsed group are dropped, and
 * parallel flows that coincide after re-routing (same source, target, and
 * `type`) are merged with their values summed.
 *
 * Pure — returns a fresh `{ nodes, edges }`; the inputs are not mutated. Node
 * order is preserved, with each super-node taking the slot of its first child.
 */
export declare function collapseGroups(data: AggregatedGraph, groups: DrillDownGroup[], collapsed: Iterable<string>): AggregatedGraph;

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
    /**
     * Which projection of the flow model to draw: `'sankey'` (the layered
     * diagram) or `'chord'` (a radial diagram — nodes as arcs on a ring, flows as
     * ribbons across the interior, for dense many-to-many relationships).
     * @default 'sankey'
     */
    readonly type?: 'sankey' | 'chord';
    /**
     * Chord only. Corner radius (px) for the rounded *outer* corners of each node
     * arc on the ring (the inner edge, where ribbons meet, stays flush). `0` gives
     * sharp corners; the value is clamped to the ring band width.
     * @default 6
     */
    readonly arcCornerRadius?: number;
    /**
     * A named built-in theme (`'light'`, `'dark'`, `'midnight'`, `'mint'`,
     * `'sunset'`), a name registered via `ApexSankey.registerTheme`, or an inline
     * {@link SankeyTheme}. Seeds coordinated visual defaults (palette, colors,
     * background); options you set explicitly still win. @default undefined (light)
     */
    readonly theme?: string | SankeyTheme;
    /** Height of the canvas. Use `'auto'` to derive height from width at a 1.6:1 ratio. @default 'auto' */
    readonly height: number | string;
    /** Localization and text-direction (RTL) options. See {@link LocaleOptions}. @default { direction: 'ltr' } */
    readonly locale?: LocaleOptions;
    /** Horizontal spacing between node columns in pixels. @default 20 */
    readonly spacing: number;
    /** Internal SVG viewport height in pixels. @default 500 */
    readonly viewPortHeight: number;
    /** Internal SVG viewport width in pixels. @default 800 */
    readonly viewPortWidth: number;
    /** Width of the canvas. Accepts a pixel number or CSS percentage string. @default '100%' */
    readonly width: number | string;
}

/** Configuration for {@link SankeyComparison} / `ApexSankey.compare`. */
export declare interface ComparisonConfig {
    /** The left ("before") panel's data. */
    readonly before: ComparisonPanelData;
    /** The right ("after") panel's data. */
    readonly after: ComparisonPanelData;
    /** Base options shared by both panels (each panel manages its own width). */
    readonly options?: Partial<SankeyOptions>;
    /** Highlight the twin node or flow in the other panel on hover. @default true */
    readonly syncHighlight?: boolean;
    /** Outline added / removed / changed flows in each panel. @default true */
    readonly showDiff?: boolean;
    /** Render the diff color legend below the panels. @default true */
    readonly showLegend?: boolean;
    /** Override the diff outline colors. */
    readonly diffColors?: ComparisonDiffColors;
}

/** Outline colors for the three diff states. */
export declare interface ComparisonDiffColors {
    /** Flows only in `after`. @default '#16a34a' */
    readonly added?: string;
    /** Flows only in `before`. @default '#dc2626' */
    readonly removed?: string;
    /** Flows whose value changed. @default '#d97706' */
    readonly changed?: string;
}

/** One side of a comparison: a flow graph plus an optional panel heading. */
export declare interface ComparisonPanelData extends AggregatedGraph {
    /** Heading shown above this panel. */
    readonly title?: string;
}

/**
 * English defaults for every {@link SankeyMessages} string. These reproduce the
 * exact screen-reader text the diagram generated before localization support.
 */
export declare const DEFAULT_SANKEY_MESSAGES: SankeyMessages;

/**
 * Diff two flow graphs (the same `{ nodes, edges }` model everything else uses).
 * Flows are matched by `source`, `target`, and `type`: a matched pair is
 * `unchanged` when its values are equal and `changed` otherwise; an unmatched
 * flow is `added` (only in `after`) or `removed` (only in `before`). Nodes are
 * matched by id. Pure — the inputs are not mutated. `after` flows are listed
 * first, in their original order, then the `before`-only (removed) flows.
 */
export declare function diffGraphs(before: AggregatedGraph, after: AggregatedGraph): GraphDiff;

/**
 * A drill-down / node-aggregation plugin: show the diagram as a set of
 * super-nodes, then expand one into its constituent flows on click (and
 * collapse it again by clicking any of its children). Every transition is
 * driven by the chart's own `update()`, so it morphs through the existing
 * spring/cross-fade machinery — collapse and expand are just topology changes.
 *
 * Built entirely on the public surface (the `node:click` event plus
 * `update()`), and on the pure {@link collapseGroups} transform, so it is both
 * a shipped feature and a worked example of the plugin API. Applies to the
 * Sankey projection (the layered `update()`); chord has no drill-down in v1.
 *
 * On install it applies the initial projection, so the plugin is the single
 * source of truth for what is shown — render any seed you like first (the fully
 * collapsed view via `ApexSankey.collapseGroups` avoids a load-time morph).
 *
 * @example
 * ```ts
 * const detail = {nodes, edges};
 * const groups = [{id: 'Fossil', title: 'Fossil', children: ['Coal', 'Gas', 'Oil']}];
 * sankey.render({...ApexSankey.collapseGroups(detail, groups, ['Fossil']), options: sankey.options});
 * sankey.use(drillDown({...detail, groups}));
 * ```
 */
export declare function drillDown(options: DrillDownOptions): SankeyPlugin;

/**
 * A drill-down group: a set of leaf nodes that collapse into one super-node.
 *
 * When the group is collapsed, its `children` disappear and a single node with
 * this `id`/`title`/`color` stands in their place; every flow touching a child
 * is re-routed to the super-node (and flows wholly inside the group vanish).
 * Groups are flat — a child cannot itself be a group id (no nesting in v1).
 */
export declare interface DrillDownGroup {
    /** Id of the super-node shown when the group is collapsed. Must be distinct from every leaf-node id. */
    readonly id: string;
    /** Label for the collapsed super-node. */
    readonly title: string;
    /** Fill color for the collapsed super-node. Falls back to the auto palette when omitted. */
    readonly color?: string;
    /** Leaf-node ids aggregated into the super-node while the group is collapsed. */
    readonly children: string[];
}

export declare interface DrillDownOptions {
    /** The full, detailed graph: every leaf node and flow, before any collapsing. */
    readonly nodes: SankeyGraphNode[];
    /** The full, detailed flows between the leaf nodes. */
    readonly edges: SankeyGraphEdge[];
    /** Group definitions. Each collapses its children into one super-node. */
    readonly groups: DrillDownGroup[];
    /** Group ids expanded on install; every other group starts collapsed. @default [] */
    readonly expanded?: string[];
}

/** One flow's diff: its identity, how it changed, and its before/after values. */
export declare interface EdgeDiff {
    /** Source node id. */
    readonly source: string;
    /** Target node id. */
    readonly target: string;
    /** Flow category. Flows are keyed by source, target, and type. */
    readonly type: string;
    /** How this flow changed between `before` and `after`. */
    readonly status: EdgeDiffStatus;
    /** Value in the `before` graph; `undefined` when the flow was added. */
    readonly beforeValue?: number;
    /** Value in the `after` graph; `undefined` when the flow was removed. */
    readonly afterValue?: number;
}

/** How a flow changed between the two compared graphs. */
export declare type EdgeDiffStatus = 'added' | 'removed' | 'changed' | 'unchanged';

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
    /** Gap in pixels between adjacent edges at their node connection points. @default 0 */
    readonly edgeGap: number;
    /** When true, edges are filled with a gradient between source and target node colors. @default true */
    readonly edgeGradientFill: boolean;
    /** Opacity of edges (0–1). @default 0.4 */
    readonly edgeOpacity: number;
    /**
     * Animate particles drifting along each flow ribbon, with density
     * proportional to the ribbon's value. Purely decorative and skipped under
     * `prefers-reduced-motion`. @default false
     */
    readonly particleFlow?: boolean;
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
 * A tiny synchronous publish/subscribe bus.
 *
 * Handler errors are isolated: one throwing listener is reported and skipped
 * so it cannot break rendering or the other listeners. `on` returns an
 * unsubscribe function for convenience.
 */
declare class EventBus {
    private readonly handlers;
    /** Subscribe to an event. Returns a function that unsubscribes this handler. */
    on(event: string, handler: EventHandler): () => void;
    /** Remove a previously-registered handler. */
    off(event: string, handler: EventHandler): void;
    /** Synchronously invoke every handler registered for `event`. */
    emit(event: string, payload?: unknown): void;
    /** Drop every handler for every event. */
    clear(): void;
}

/** A single event listener. */
declare type EventHandler<T = unknown> = (payload: T) => void;

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

/** A point in graph (viewBox) space. */
export declare interface GraphAnchor {
    readonly x: number;
    readonly y: number;
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

/** The structural difference between two flow graphs. */
export declare interface GraphDiff {
    /** Every flow across both graphs, tagged with its {@link EdgeDiffStatus}. */
    readonly edges: EdgeDiff[];
    /** Node ids present only in `after`. */
    readonly addedNodes: string[];
    /** Node ids present only in `before`. */
    readonly removedNodes: string[];
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
    /** Flow direction of the diagram: `'horizontal'` (ranks in columns, flows left→right) or `'vertical'` (ranks in rows, flows top→bottom). @default 'horizontal' */
    readonly orientation?: 'horizontal' | 'vertical';
    /**
     * Titles drawn above each column (or beside each row when vertical), one per
     * rank — the axis/dimension labels of an alluvial diagram. Index `i` labels
     * rank `i`; omit or leave short to skip trailing axes. @default undefined
     */
    readonly axisTitles?: string[];
}

/**
 * Localization and text-direction options.
 *
 * With the defaults (`direction: 'ltr'`, no message overrides) the output is
 * byte-for-byte identical to builds that predate i18n support.
 */
export declare interface LocaleOptions {
    /**
     * Text and layout direction. `'rtl'` mirrors the diagram horizontally (flows
     * read right-to-left) and sets `dir="rtl"` on the container; `'auto'` defers
     * to the document/element direction.
     * @default 'ltr'
     */
    readonly direction?: TextDirection;
    /** Overrides for screen-reader strings. See {@link SankeyMessages}. */
    readonly messages?: Partial<SankeyMessages>;
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
    /**
     * Ordered fill colors cycled across nodes that do not set their own `color`.
     * Overrides the built-in palette; a `theme` sets this for you. @default undefined (built-in palette)
     */
    readonly nodePalette?: string[];
    /**
     * Allow nodes to be repositioned by dragging with a pointer (mouse, touch, or
     * pen). Connected flows follow the node live; the manual position holds until
     * the next `render()`/`update()` recomputes the layout. @default false
     */
    readonly draggableNodes?: boolean;
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

/**
 * A path-tracing plugin: on picking a node, a bright pulse cascades along the
 * connected flow path, ribbon by ribbon, cueing the eye to where the flow goes.
 *
 * Built on the public plugin surface — the event bus plus `chart.graph` — and
 * the ribbon centerline geometry, so it is both a shipped feature and a worked
 * example of the plugin API. Skipped under `prefers-reduced-motion`. Applies to
 * the Sankey projection (no-ops for chord, which has no layered path).
 *
 * @example
 * ```ts
 * sankey.use(pathTrace({direction: 'downstream'}));
 * ```
 */
export declare function pathTrace(options?: PathTraceOptions): SankeyPlugin;

export declare interface PathTraceOptions {
    /** What starts a trace. @default 'click' */
    readonly trigger?: 'click' | 'hover';
    /** Which way flow is traced from the picked node. @default 'downstream' */
    readonly direction?: 'downstream' | 'upstream' | 'both';
    /** Pulse color. @default '#ffffff' */
    readonly color?: string;
    /** Milliseconds for a pulse to cross one ribbon. @default 700 */
    readonly duration?: number;
    /** Milliseconds added per BFS depth, so the trace cascades outward. @default 220 */
    readonly stagger?: number;
}

/**
 * A side-by-side comparison of two Sankey diagrams — a "before" and an "after"
 * of the same flow model. It renders two {@link ApexSankey} instances in one
 * host element, outlines each flow by how it changed (added / removed /
 * changed, from the pure {@link diffGraphs} transform), and links the panels so
 * hovering a node or flow highlights its twin in the other.
 *
 * Built on the public surface only (two ordinary `ApexSankey` instances plus
 * their `node:*` and `edge:*` events) so it stays the same "one engine" the rest
 * of the library is. Reach it through `ApexSankey.compare(element, config)` or
 * construct directly and call {@link render}.
 *
 * @example
 * ```ts
 * const cmp = ApexSankey.compare(el, {
 *   before: {nodes, edges: edges2024, title: '2024'},
 *   after: {nodes, edges: edges2025, title: '2025'},
 * });
 * // later: cmp.destroy();
 * ```
 */
export declare class SankeyComparison {
    private readonly element;
    private readonly config;
    /** The left ("before") chart instance, available after {@link render}. */
    before?: ApexSankey;
    /** The right ("after") chart instance, available after {@link render}. */
    after?: ApexSankey;
    /** The computed structural difference between the two graphs. */
    readonly diff: GraphDiff;
    private root;
    private readonly teardowns;
    /** Guards the synchronized-hover loop: true while dispatching a synthetic event. */
    private syncing;
    /** The node element currently synthetically highlighted in each panel. */
    private readonly entered;
    constructor(element: HTMLElement, config: ComparisonConfig);
    /** Build the panels, render both diagrams, apply the diff cues, and link hover. */
    render(): this;
    /** Tear down both charts and remove the injected DOM. Idempotent. */
    destroy(): void;
    private buildPanel;
    private buildLegend;
    /** Outline the flows this side is responsible for, mirroring the cyclic-edge outline style. */
    private applyDiff;
    private link;
    private syncEnter;
    private syncLeave;
    private findNode;
    private findEdge;
}

/** Context passed to {@link SankeyMessages.diagramLabel}. */
export declare interface SankeyDiagramLabelContext {
    /** Number of (non-dummy) nodes in the diagram. */
    readonly nodeCount: number;
    /** Number of flows (edges). */
    readonly flowCount: number;
    /** The single largest flow, omitted when no value-bearing flow exists. */
    readonly largestFlow?: {
        readonly source: string;
        readonly target: string;
        readonly value: number;
    };
}

/** Payload for the `edge:*` events. */
export declare interface SankeyEdgeEventArgs {
    /** Source node id. */
    readonly source: string;
    /** Target node id. */
    readonly target: string;
    /** The flow value carried by this edge. */
    readonly value: number;
    /** The DOM event that triggered this (a `MouseEvent`). */
    readonly originalEvent: Event;
}

/** Context passed to {@link SankeyMessages.edgeAriaLabel}. */
export declare interface SankeyEdgeLabelContext {
    /** Source node name. */
    readonly source: string;
    /** Target node name. */
    readonly target: string;
    /** Flow value. */
    readonly value: number;
}

/**
 * The events an `ApexSankey` instance emits, mapped to their payload type.
 * Subscribe with {@link ApexSankey.on}. `rendered` fires after the initial
 * render and after every `update()` settles; `destroyed` fires on `destroy()`.
 */
export declare interface SankeyEventMap {
    'node:click': SankeyNodeEventArgs;
    'node:mouseenter': SankeyNodeEventArgs;
    'node:mouseleave': SankeyNodeEventArgs;
    'edge:click': SankeyEdgeEventArgs;
    'edge:mouseenter': SankeyEdgeEventArgs;
    'edge:mouseleave': SankeyEdgeEventArgs;
    rendered: void;
    destroyed: void;
}

/** Names of the events an `ApexSankey` instance emits. */
export declare type SankeyEventName = keyof SankeyEventMap;

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
    private readonly events?;
    graph: SankeyGraph;
    maxRank: number;
    /** Options resolved with CSS custom property overrides for the current render pass. */
    private renderOptions;
    /** Accessibility helper — re-created on each render pass. */
    private a11yHelper;
    /** Path highlighter — re-created on each render pass when feature is enabled. */
    private pathHighlighter;
    /** Node-drag interaction — re-created on each render pass when `draggableNodes` is enabled. */
    private nodeDrag;
    /** Particle-flow effect — re-created on each render pass when `particleFlow` is enabled. */
    private particleFlow;
    /** Guard: entrance animation plays only on the first render. */
    private _hasAnimated;
    /** Resolved, localized screen-reader strings. */
    private messages;
    /**
     * DOM-construction backend. The SVG renderer today; the interface is the seam
     * a deferred Canvas backend would implement without touching orchestration.
     */
    private readonly renderer;
    /** Geometry of the last committed render — the "from" state for an animated `update()`. */
    private lastGeometry;
    /** Active relayout animation driver, if one is running. */
    private relayoutMotion;
    /** The `<g>` layer for the current render, retained so an animated update can cross-fade from it. */
    private currentMainGroup;
    /** Radial (chord) renderer, used when `options.type === 'chord'`. */
    private readonly chordRenderer;
    /** Resolved chord input (palette applied), set by `construct` in chord mode. */
    private chordData;
    constructor(element: HTMLElement, options: SankeyOptions, chartContext: ChartContext, events?: EventBus | undefined);
    /** Resolved, localized screen-reader strings (English defaults + `locale.messages`). */
    getMessages(): SankeyMessages;
    /** Whether the current `locale.direction` resolves to right-to-left. */
    private get isRtl();
    construct(data: GraphData): void;
    /** Resolve palette colors onto the raw nodes and stash the chord input for `renderChord`. */
    private constructChord;
    /**
     * Mirror the laid-out diagram horizontally so flows read right-to-left.
     * Node centers and edge endpoints are reflected around a common axis (the
     * midpoint of all node centers), which keeps every edge attached to the
     * correct node face. Runs once per `construct`, so re-renders redraw the
     * already-mirrored positions without compounding.
     */
    private mirrorLayoutForRtl;
    render({ keepOldPosition }?: {
        keepOldPosition?: boolean | undefined;
    }): void;
    /**
     * Render the radial (chord) projection: compute the ring layout from the
     * resolved chord input and draw it through `ChordRenderer`. No entrance
     * animation, relayout, drag, or particle layer in this mode (v1).
     */
    private renderChord;
    /**
     * Update the diagram to new data. When the new layout shares the current
     * topology (same nodes, edges and edge routing) the change is spring-animated:
     * node positions, heights and flow ribbons interpolate to their new places.
     * Otherwise (first render, added/removed nodes or edges, animation disabled,
     * or `prefers-reduced-motion`) it falls back to an instant `render()`.
     */
    update(data: GraphData, transition?: SankeyTransition): void;
    /**
     * Spring the live graph from `from` to `to`, redrawing the geometry each frame,
     * then commit a canonical `render()` (interactions + a11y) once the spring
     * settles. A single progress spring drives the whole reflow; because a linear
     * spring's normalized trajectory is amplitude-independent, every node and flow
     * moves in lockstep and stays attached throughout.
     */
    private animateRelayout;
    /**
     * Spring the live graph's geometry from `from` to `to` (both snapshots of the
     * current topology), drawing each interpolated frame, then run `onSettle` once
     * at rest. `onSettle` decides what to commit — usually a canonical `render()`,
     * but a drill-down collapse uses it to construct + render the new layout after
     * the leaving nodes have converged.
     */
    private animateGeometry;
    /** Build a geometry-only layer (no interaction/a11y wiring) and add it on top without clearing. */
    private buildLayer;
    /**
     * Clear and redraw the geometry-only layer from the current graph. Used for
     * intermediate relayout frames; the final committed frame goes through the
     * full `render()`.
     */
    private drawGeometry;
    /**
     * Morph through a structural change by *sliding through it* rather than
     * cross-fading two whole layouts. The new layout is drawn on top and its
     * geometry sprung from a {@link growStartGeometry} start toward `to`: entering
     * flows unfurl out of their source node, survivors slide from their old places
     * to their new ones, entering nodes grow up from zero height. The outgoing
     * layer keeps only the *leaving* elements (survivors on it are hidden, so they
     * never ghost the ones now sliding on the new layer) and fades them out, so a
     * removed flow retracts visually instead of blinking away. At rest a canonical
     * `render()` commits the new layout with fresh interaction + a11y wiring.
     * Interruptible via `reset`.
     */
    private morphGrow;
    /**
     * Hide every node/flow on `oldLayer` that also exists in `to` (the survivors),
     * leaving only the elements that are disappearing. The survivors are redrawn
     * and animated on the new layer, so hiding them here prevents a double image.
     */
    private hideSurvivorsOnOldLayer;
    private prefersReducedMotion;
}

/**
 * Every user-facing string the Sankey diagram generates internally (the
 * screen-reader summaries and group labels). Override any subset via
 * {@link LocaleOptions.messages}; unset keys keep their English defaults
 * ({@link DEFAULT_SANKEY_MESSAGES}). Visible tooltips are localized separately
 * through `tooltipTemplate` / `nodeTooltipTemplate`.
 */
export declare interface SankeyMessages {
    /** Builds the SVG root aria-label summary. */
    readonly diagramLabel: (ctx: SankeyDiagramLabelContext) => string;
    /** Builds an edge path's aria-label. */
    readonly edgeAriaLabel: (ctx: SankeyEdgeLabelContext) => string;
    /** Builds a node group's aria-label. */
    readonly nodeAriaLabel: (ctx: SankeyNodeLabelContext) => string;
    /** aria-label for the `<g>` wrapping all nodes. @default 'Sankey nodes' */
    readonly nodesGroupLabel: string;
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

/** Payload for the `node:*` events. */
export declare interface SankeyNodeEventArgs {
    /** The node's id. */
    readonly id: string;
    /** The laid-out node (position, value, and user `data`). */
    readonly node: SankeyNode;
    /** The DOM event that triggered this (a `MouseEvent`). */
    readonly originalEvent: Event;
}

/** Context passed to {@link SankeyMessages.nodeAriaLabel}. */
export declare interface SankeyNodeLabelContext {
    /** Resolved node display name. */
    readonly name: string;
    /** Incoming flow summary, omitted when the node has no incoming flows. */
    readonly incoming?: {
        readonly total: number;
        readonly sources: readonly string[];
    };
    /** Outgoing flow summary, omitted when the node has no outgoing flows. */
    readonly outgoing?: {
        readonly total: number;
        readonly targets: readonly string[];
    };
}

/**
 * Full configuration type for `ApexSankey`. An intersection of all sub-option
 * interfaces: `CommonOptions & EdgeOptions & FontOptions & InteractionOptions &
 * AnimationOptions & LayoutOptions & NodeOptions & TooltipOptions & A11yOptions`.
 *
 * Pass a `Partial<SankeyOptions>` to the constructor — all fields have defaults.
 */
export declare type SankeyOptions = CommonOptions & EdgeOptions & FontOptions & InteractionOptions & AnimationOptions & LayoutOptions & NodeOptions & TooltipOptions & A11yOptions;

/**
 * A reusable extension. `use(plugin)` calls `install` once with a
 * {@link SankeyPluginContext}; return a teardown function to release anything
 * that outlives the event subscriptions (timers, injected DOM, etc.).
 *
 * @example
 * ```ts
 * const logger: SankeyPlugin = {
 *   name: 'logger',
 *   install({on}) {
 *     return on('node:click', ({id}) => console.log('clicked', id));
 *   },
 * };
 * sankey.use(logger);
 * ```
 */
export declare interface SankeyPlugin {
    /** A unique name, used for diagnostics. */
    readonly name: string;
    /** Called once on `use()`. Optionally return a teardown run on `destroy()`. */
    install(ctx: SankeyPluginContext): void | (() => void);
}

/**
 * What a plugin receives when it is installed. Use `on` to subscribe (returns
 * an unsubscribe function) and `chart` to drive or read the instance. Any
 * unsubscribe you register, plus the optional teardown you return from
 * `install`, run automatically when the chart is destroyed.
 */
export declare interface SankeyPluginContext {
    /** The chart instance the plugin is installed on. */
    readonly chart: ApexSankey;
    /** Subscribe to an event; returns an unsubscribe function. */
    on<K extends SankeyEventName>(event: K, handler: (payload: SankeyEventMap[K]) => void): () => void;
}

/**
 * A named, coordinated set of visual defaults applied via the `theme` option.
 *
 * Every field maps to a top-level {@link SankeyOptions} property. Applying a
 * theme seeds those options; any option you pass explicitly still wins over the
 * theme, and the theme in turn wins over the built-in defaults. Omitted fields
 * leave that option at its default. Register your own with
 * `ApexSankey.registerTheme(name, theme)` for brand presets.
 */
export declare interface SankeyTheme {
    /** Ordered node fill colors, cycled across nodes that do not set their own `color`. */
    readonly nodePalette?: string[];
    /** CSS color for node labels. */
    readonly fontColor?: string;
    /** Opacity of the flow ribbons (0–1). */
    readonly edgeOpacity?: number;
    /** Fill ribbons with a source→target gradient. */
    readonly edgeGradientFill?: boolean;
    /** CSS color for the node border. `null` disables it. */
    readonly nodeBorderColor?: string | null;
    /** CSS applied to the SVG root container — typically the background and border. */
    readonly canvasStyle?: string;
    /** Tooltip color preset. */
    readonly tooltipTheme?: 'dark' | 'light';
}

/**
 * An optional animation hint for {@link SankeyGraphRenderer.update}. Used by the
 * drill-down plugin to make a topology change read as an expand/collapse rather
 * than a plain cross-fade: entering nodes grow out of a parent, or leaving nodes
 * shrink into it.
 */
export declare interface SankeyTransition {
    /** Grow these entering node ids out of `anchor` (drill-down expand). */
    readonly growFrom?: {
        readonly anchor: GraphAnchor;
        readonly nodes: string[];
    };
    /** Shrink these leaving node ids into `anchor`, then commit the new layout (drill-down collapse). */
    readonly shrinkInto?: {
        readonly anchor: GraphAnchor;
        readonly nodes: string[];
    };
}

export { TextDirection }

/**
 * A time-playback plugin: step the diagram through a sequence of data frames,
 * driven by the chart's own `update()` so topology-stable frames spring
 * smoothly from one to the next. Ships a small control bar (play/pause + a
 * scrubber); set `controls: false` to drive it purely by `autoplay`/`loop`.
 *
 * Built on the public `update()` surface, so it works for any Sankey the chart
 * can render. Frames should share topology (same nodes and flows, differing
 * values) for a smooth morph; a differing topology cross-fades instead.
 *
 * @example
 * ```ts
 * sankey.render({...frames[0], options: sankey.options});
 * sankey.use(timePlayback({frames, interval: 1500, loop: true}));
 * ```
 */
export declare function timePlayback(options: TimePlaybackOptions): SankeyPlugin;

/** One time step. Frames that share topology (same nodes/flows) morph smoothly. */
export declare interface TimePlaybackFrame {
    nodes: SankeyGraphNode[];
    edges: SankeyGraphEdge[];
    /** Label shown in the control bar for this frame. Defaults to `Frame i / n`. */
    label?: string;
}

export declare interface TimePlaybackOptions {
    /** The ordered frames to play through. */
    readonly frames: TimePlaybackFrame[];
    /** Milliseconds each frame is shown before advancing. @default 1600 */
    readonly interval?: number;
    /** Start playing on install. @default false */
    readonly autoplay?: boolean;
    /** Loop back to the first frame after the last. @default false */
    readonly loop?: boolean;
    /** Render the built-in control bar (play/pause + scrubber). @default true */
    readonly controls?: boolean;
    /** Where to mount the control bar. Defaults to just after the chart container. */
    readonly mount?: HTMLElement;
}

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
