# ApexSankey

A JavaScript library to create Sankey diagrams built on SVG

<img width="752" alt="apex-sankey-chart" src="https://github.com/apexcharts/projects/assets/17950663/51e00ff0-79d1-45eb-8815-f8d11e2dd981">

## Dependency

Include svg.js

```bash
<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js"></script>
```

## Installation

To add the ApexSankey to your project and its dependencies, install the package from npm.

```bash
npm install apexsankey
```

## Usage

```js
import ApexSankey from 'apexsankey';
```

To create a basic sankey with minimal configuration, write as follows:

```html
<div id="sankey-container"></div>
```

```js
 const data = {
   ...(data with format provided below)
 }
 const options = {
    width: 800,
    height: 800,
    canvasStyle: 'border: 1px solid #caced0; background: #f6f6f6;',
    spacing: 100,
    nodeWidth: 20,
 };
 const sankey = new ApexSankey(document.getElementById('sankey-container'), options);
 const graph = sankey.render(data);
```

## Setting the License

To use ApexSankey with a commercial license, set your license key before creating any chart instances:

```js
import ApexSankey from 'apexsankey';

// set license key before creating any charts
ApexSankey.setLicense('your-license-key');

const sankey = new ApexSankey(document.getElementById('sankey-container'), options);
const graph = sankey.render(data);
```

## Methods

Methods available on an `ApexSankey` instance:

| Method | Description |
| --- | --- |
| `render(data)` | Build the diagram from `data` (`{ nodes, edges }`) and write the SVG into the container. Returns the internal graph renderer, which exposes `exportToSvg()`. |
| `update(data)` | Transition an already-rendered instance to new `data`. When the new layout shares the current topology (same nodes and flows, only different values or positions), the nodes and ribbons spring smoothly to their new places. When the topology differs, it morphs through the change: entering flows grow out of their source node, survivors slide to their new places, and removed flows retract and dissolve. When animation is disabled or the user prefers reduced motion, it redraws instantly. |
| `ApexSankey.setLicense(key)` | Static. Set the commercial license key before creating any chart instances. |
| `ApexSankey.registerTheme(name, theme)` | Static. Register (or override) a named theme (a `SankeyTheme`), then reference it by name via the `theme` option. Use for brand presets. |
| `ApexSankey.collapseGroups(data, groups, collapsed)` | Static. Project a detailed `{ nodes, edges }` to an aggregated one by collapsing the listed groups into super-nodes (re-routing and merging their flows). The pure transform behind the `drillDown` plugin; use it to seed the initial collapsed render. |
| `ApexSankey.compare(element, config)` | Static. Render two linked diagrams (a "before" and an "after") side by side, outlining each flow by how it changed and highlighting the twin node or flow across both panels on hover. Returns a `SankeyComparison` handle (`before` / `after` / `diff` / `destroy()`). See [Comparison split-view](#comparison-split-view). |
| `on(event, handler)` | Subscribe to an instance event (see [Plugins & Events](#plugins--events)). Returns an unsubscribe function. |
| `off(event, handler)` | Remove a handler previously registered with `on`. |
| `use(plugin)` | Install a `SankeyPlugin`. Its `install` runs immediately; any teardown it returns runs on `destroy()`. Returns the instance. |
| `destroy()` | Tear down the chart: run plugin teardowns, emit `destroyed`, drop all handlers, and remove injected DOM (tooltip container). |

## ApexSankey Options

The layout can be configured by passing a second argument to `ApexSankey` with the properties listed below.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | `'100%'` | Width of the canvas. Accepts a pixel number or CSS percentage string. |
| `height` | `number \| string` | `'auto'` | Height of the canvas. `'auto'` derives height from width at a 1.6:1 ratio. |
| `canvasStyle` | `string` | built-in border | Arbitrary CSS injected onto the SVG root container element. |
| `type` | `'sankey' \| 'chord'` | `'sankey'` | Which projection of the flow model to draw. `'chord'` renders a radial diagram (nodes as arcs on a ring, flows as ribbons across the interior) for dense many-to-many relationships. See [Chord](#chord). |
| `arcCornerRadius` | `number` | `6` | Chord only. Corner radius (px) for the rounded outer corners of each node arc (the inner edge, where ribbons meet, stays flush). `0` gives sharp corners; clamped to the ring band width. |
| `theme` | `string \| SankeyTheme` | `undefined` | A named built-in theme (`'light'`, `'dark'`, `'midnight'`, `'mint'`, `'sunset'`), a name registered via `ApexSankey.registerTheme`, or an inline `SankeyTheme`. Seeds coordinated visual defaults (palette, colors, background); options you set explicitly still win. See [Themes](#themes). |
| `spacing` | `number` | `20` | Horizontal spacing between node columns in pixels. |
| `nodeWidth` | `number` | `20` | Width of each node rectangle in pixels. |
| `nodeBorderWidth` | `number` | `1` | Border width of each node in pixels. |
| `nodeBorderColor` | `string \| null` | `null` | CSS color for the node border. `null` disables the border. |
| `nodePalette` | `string[]` | `undefined` | Ordered fill colors cycled across nodes that do not set their own `color`. Overrides the built-in palette; a `theme` sets this for you. |
| `draggableNodes` | `boolean` | `false` | Allow nodes to be repositioned by dragging with a pointer (mouse, touch, or pen). Connected flows follow the node live; the manual position holds until the next `render()`/`update()` recomputes the layout. |
| `onNodeClick` | `(node: SankeyNode) => void` | `undefined` | Callback fired when the user clicks a node. |
| `edgeOpacity` | `number` | `0.4` | Opacity of edges (0–1). |
| `edgeGradientFill` | `boolean` | `true` | Fill edges with a gradient between source and target node colors. |
| `particleFlow` | `boolean` | `false` | Animate particles drifting along each flow ribbon, with density proportional to the ribbon's value. Purely decorative; skipped under `prefers-reduced-motion`. |
| `edgeGap` | `number` | `0` | Gap in pixels between adjacent edges at node connection points. |
| `whitespace` | `number` | `0.18` | Fraction of vertical space used as margins between nodes (0–1). Lower = taller nodes. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Flow direction. `'horizontal'` lays ranks out in columns (flows left→right); `'vertical'` lays them in rows (flows top→bottom). |
| `axisTitles` | `string[]` | `undefined` | Titles drawn above each column (or beside each row when vertical), one per rank — the axis/dimension labels of an alluvial diagram. Index `i` labels rank `i`. See [Alluvial](#alluvial). |
| `viewPortWidth` | `number` | `800` | Internal SVG viewport width in pixels. |
| `viewPortHeight` | `number` | `500` | Internal SVG viewport height in pixels. |
| `highlightConnectedPath` | `boolean` | `true` | Highlight connected flows on interaction. Hovering a node or flow gives a one-hop preview; clicking a node or flow pins an isolate of its full upstream/downstream path (click again, or click another, to change/release). |
| `dimOpacity` | `number` | `0.2` | Opacity for dimmed (unrelated) elements when path highlighting is active. |
| `animation` | `{ enabled: boolean, duration: number }` | `{ enabled: true, duration: 800 }` | Entrance animation. Automatically disabled when `prefers-reduced-motion` is set. |
| `enableTooltip` | `boolean` | `true` | Show edge tooltips on hover. |
| `enableToolbar` | `boolean` | `true` | Show the zoom/pan toolbar. |
| `tooltipId` | `string` | `'apexsankey-tooltip-container'` | HTML `id` for the tooltip container element. |
| `tooltipTemplate` | `(content: TooltipContent) => string` | built-in | Custom function returning an HTML string for the edge (source→target) tooltip. |
| `nodeTooltipTemplate` | `(content: NodeTooltipContent) => string` | built-in | Custom function returning an HTML string for the per-node tooltip. |
| `tooltipTheme` | `'light' \| 'dark'` | `undefined` | Overrides `tooltipBGColor`/`tooltipBorderColor`/`tooltipFontColor` with a preset. |
| `tooltipBorderColor` | `string` | `'#E2E8F0'` | Border color of the tooltip. |
| `tooltipBGColor` | `string` | `'#FFFFFF'` | Background color of the tooltip. |
| `tooltipFontColor` | `string` | `'#1a1a1a'` | Font color inside the tooltip. |
| `fontColor` | `string` | `'#212121'` | CSS color for node labels. |
| `fontFamily` | `string` | `''` | CSS font-family for node labels. Falls back to the page default when empty. |
| `fontSize` | `string` | `'14px'` | CSS font-size for node labels. |
| `fontWeight` | `string` | `'400'` | CSS font-weight for node labels. |
| `a11y` | `{ enabled?: boolean, diagramLabel?: string, description?: string }` | `{ enabled: true }` | WCAG 2.1 AA accessibility options. |
| `locale` | `{ direction?: 'ltr' \| 'rtl' \| 'auto', messages?: Partial<SankeyMessages> }` | `{ direction: 'ltr' }` | Localization and text-direction. `direction: 'rtl'` mirrors the diagram horizontally (flows read right-to-left) and sets `dir="rtl"` on the container (`'auto'` defers to the document). `messages` overrides the screen-reader strings the diagram generates. |

### Chord

Set `type: 'chord'` to draw the radial projection of the same `{ nodes, edges }` model: each node becomes an arc on a ring (its span proportional to total incident flow) and each edge a ribbon crossing the interior. It suits dense many-to-many or symmetric relationships (migration, co-occurrence, adjacency) where a layered Sankey turns into spaghetti. Hovering an arc or ribbon focuses its connections and dims the rest. The arcs' outer corners are rounded by default (`arcCornerRadius`); set it to `0` for sharp corners.

```js
const sankey = new ApexSankey(el, {type: 'chord'});
sankey.render({
  nodes: [
    {id: 'A', title: 'A'},
    {id: 'B', title: 'B'},
    {id: 'C', title: 'C'},
  ],
  edges: [
    {source: 'A', target: 'B', value: 12, type: 'x'},
    {source: 'B', target: 'C', value: 8, type: 'x'},
    {source: 'C', target: 'A', value: 5, type: 'x'},
  ],
});
```

Chord mode reuses the tooltip, node/edge click events, and color palette. Sankey-only features (multi-orientation, RTL mirror, animated relayout, node dragging, particle flow) do not apply to it.

### Alluvial

An alluvial diagram is the same engine as a Sankey, reached through the same `{ nodes, edges }` model. `ApexSankey.buildAlluvialData` (also exported as `buildAlluvialData`) turns categorical records-across-dimensions into that model so you do not hand-build it: it creates one node per (dimension, category) and one edge per adjacent-dimension transition, with each category keeping the same color across every dimension so a cohort reads as one continuous stream. Pair it with `axisTitles` for the dimension labels.

```js
const input = {
  dimensions: ['2019', '2022', '2025'],
  records: [
    {values: {2019: 'Free', 2022: 'Pro', 2025: 'Pro'}},
    {values: {2019: 'Free', 2022: 'Free', 2025: 'Churned'}},
    {values: {2019: 'Pro', 2022: 'Pro', 2025: 'Team'}, value: 3},
  ],
};

const sankey = new ApexSankey(el, {axisTitles: input.dimensions});
sankey.render({...ApexSankey.buildAlluvialData(input), options: sankey.options});
```

`AlluvialInput` fields:

| Field        | Type               | Description                                                    |
| ------------ | ------------------ | -------------------------------------------------------------- |
| `dimensions` | `string[]`         | Ordered dimension (axis) ids, left → right.                    |
| `records`    | `AlluvialRecord[]` | The subjects flowing across the dimensions.                    |
| `palette`    | `string[]`         | Optional category color palette, cycled per distinct category. |

Each `AlluvialRecord` is `{ values: Record<string, string>, value?: number }` — the category at each dimension (keyed by dimension id), and the weight it contributes (default `1`). A record missing a category at some dimension simply skips that adjacency.

### Plugins & Events

Subscribe to instance events with `on` (it returns an unsubscribe function), or package reusable behaviour as a `SankeyPlugin` and install it with `use`.

```js
// events
const off = sankey.on('node:click', ({id, node, originalEvent}) => {
  console.log('clicked', id);
});
// ...later
off();

// a reusable plugin: log every clicked node, cleaned up on destroy()
sankey.use({
  name: 'click-logger',
  install: ({chart, on}) => on('node:click', ({id}) => console.log('clicked', id)),
});
```

Emitted events and their payloads:

| Event | Payload | When |
| --- | --- | --- |
| `node:click` | `{ id, node, originalEvent }` | A node is clicked. |
| `node:mouseenter` | `{ id, node, originalEvent }` | The pointer enters a node. |
| `node:mouseleave` | `{ id, node, originalEvent }` | The pointer leaves a node. |
| `edge:click` | `{ source, target, value, originalEvent }` | A flow (edge) is clicked. |
| `edge:mouseenter` | `{ source, target, value, originalEvent }` | The pointer enters a flow. |
| `edge:mouseleave` | `{ source, target, value, originalEvent }` | The pointer leaves a flow. |
| `rendered` | none | After the initial render and after each `update()` settles. |
| `destroyed` | none | On `destroy()`. |

A `SankeyPlugin` is `{ name, install(ctx) }`. `install` receives `{ chart, on }` and may return a teardown function that runs on `destroy()`. Every subscription made through `ctx.on` is also released automatically on `destroy()`.

#### Built-in plugins

`pathTrace` ships with the library (importable as `pathTrace`, or `ApexSankey.plugins.pathTrace`). Installing it makes a bright pulse cascade along the connected flow path when a node is picked, ribbon by ribbon, cueing the eye to where the flow goes. It is skipped under `prefers-reduced-motion` and applies to the Sankey projection (not chord).

```js
sankey.use(pathTrace({direction: 'downstream'}));
```

| `PathTraceOptions` | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `'click' \| 'hover'` | `'click'` | What starts a trace. |
| `direction` | `'downstream' \| 'upstream' \| 'both'` | `'downstream'` | Which way flow is traced from the picked node. |
| `color` | `string` | `'#ffffff'` | Pulse color. |
| `duration` | `number` | `700` | Milliseconds for a pulse to cross one ribbon. |
| `stagger` | `number` | `220` | Milliseconds added per hop, so the trace cascades outward. |

`timePlayback` steps the diagram through a sequence of data frames, driven by the chart's own `update()` so topology-stable frames spring smoothly from one to the next. It ships a small control bar (play/pause + a scrubber). Importable as `timePlayback` or `ApexSankey.plugins.timePlayback`.

```js
sankey.render({...frames[0], options: sankey.options});
sankey.use(timePlayback({frames, interval: 1500, loop: true}));
```

| `TimePlaybackOptions` | Type | Default | Description |
| --- | --- | --- | --- |
| `frames` | `TimePlaybackFrame[]` | required | Ordered frames (`{ nodes, edges, label? }`). Share topology across frames for a smooth morph. |
| `interval` | `number` | `1600` | Milliseconds each frame is shown before advancing. |
| `autoplay` | `boolean` | `false` | Start playing on install. |
| `loop` | `boolean` | `false` | Loop back to the first frame after the last. |
| `controls` | `boolean` | `true` | Render the built-in control bar. |
| `mount` | `HTMLElement` | after the chart | Where to render the control bar. |

`drillDown` turns a large diagram into a set of super-nodes you expand on demand: click a super-node to reveal its constituent flows, click any of its children to collapse it back. The drillable nodes get a `pointer` cursor so they read as clickable. Expanding animates the children **growing out of the super-node** (and shrinking back into it on collapse) with their ribbons — driven through the chart's own `update()` (which accepts an optional `SankeyTransition` hint for this). It is built on the pure `ApexSankey.collapseGroups` transform (also exported as `collapseGroups`), which re-routes and merges the flows of a collapsed group. Importable as `drillDown` or `ApexSankey.plugins.drillDown`; applies to the Sankey projection (not chord). Seed the initial collapsed render with `ApexSankey.collapseGroups` so there is no load-time morph.

```js
const detail = {nodes, edges};
const groups = [{id: 'Fossil', title: 'Fossil', children: ['Coal', 'Gas', 'Oil']}];
sankey.render({...ApexSankey.collapseGroups(detail, groups, ['Fossil']), options: sankey.options});
sankey.use(drillDown({...detail, groups}));
```

| `DrillDownOptions` | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `SankeyGraphNode[]` | required | The full, detailed leaf nodes before any collapsing. |
| `edges` | `SankeyGraphEdge[]` | required | The full, detailed flows between the leaf nodes. |
| `groups` | `DrillDownGroup[]` | required | Group definitions (`{ id, title, color?, children }`); each collapses its children into one super-node. |
| `expanded` | `string[]` | `[]` | Group ids expanded on install; every other group starts collapsed. |

### Comparison split-view

`ApexSankey.compare(element, config)` renders two diagrams of the same flow model side by side — a "before" and an "after". It outlines each flow by how it changed between them (added, removed, or changed, from the pure `diffGraphs` transform, also exported), draws a legend, and links the panels so hovering a node or flow highlights its twin in the other. It is built on the public surface only (two ordinary `ApexSankey` instances plus their `node:*` and `edge:*` events) and returns a `SankeyComparison` handle exposing `before`, `after`, the computed `diff`, and `destroy()`.

```js
const cmp = ApexSankey.compare(el, {
  before: {nodes, edges: edges2024, title: '2024'},
  after: {nodes, edges: edges2025, title: '2025'},
});
// later: cmp.destroy();
```

| `ComparisonConfig` | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `{ nodes, edges, title? }` | required | The left panel's flow graph and optional heading. |
| `after` | `{ nodes, edges, title? }` | required | The right panel's flow graph and optional heading. |
| `options` | `Partial<SankeyOptions>` | `{}` | Base options shared by both panels (each manages its own width). |
| `syncHighlight` | `boolean` | `true` | Highlight the twin node or flow in the other panel on hover (a cursor lands on a ribbon at least as readily as on a node). |
| `showDiff` | `boolean` | `true` | Outline added / removed / changed flows in each panel. |
| `showLegend` | `boolean` | `true` | Render the diff color legend below the panels. |
| `diffColors` | `{ added?, removed?, changed? }` | greens/reds/ambers | Override the diff outline colors. |

### Themes

Pass `theme` to seed a coordinated set of visual defaults in one shot. Built-in themes: `'light'` (the default look), `'dark'`, `'midnight'`, `'mint'`, and `'sunset'`. A theme sits between the built-in defaults and your explicit options, so anything you set yourself still wins.

```js
const sankey = new ApexSankey(el, {theme: 'dark'});
```

Register a brand preset once, then reference it by name:

```js
ApexSankey.registerTheme('acme', {
  nodePalette: ['#ff5a5f', '#087f8c', '#5d2e8c'],
  fontColor: '#1a1a1a',
  canvasStyle: 'background: #faf7f2; box-sizing: border-box;',
});
const sankey = new ApexSankey(el, {theme: 'acme'});
```

You can also pass an inline `SankeyTheme` object directly as `theme`. A `SankeyTheme` may set any subset of the following (each maps to the option of the same name; omitted fields keep their default):

| `SankeyTheme` field | Type                | Description                                                              |
| ------------------- | ------------------- | ------------------------------------------------------------------------ |
| `nodePalette`       | `string[]`          | Ordered node fill colors, cycled across nodes without their own `color`. |
| `fontColor`         | `string`            | CSS color for node labels.                                               |
| `edgeOpacity`       | `number`            | Opacity of the flow ribbons (0–1).                                       |
| `edgeGradientFill`  | `boolean`           | Fill ribbons with a source→target gradient.                              |
| `nodeBorderColor`   | `string \| null`    | CSS color for the node border (`null` disables).                         |
| `canvasStyle`       | `string`            | CSS on the SVG root container, typically the background and border.      |
| `tooltipTheme`      | `'light' \| 'dark'` | Tooltip color preset.                                                    |

### Localization & RTL

The diagram's screen-reader strings live in `SankeyMessages`; pass a `Partial<SankeyMessages>` via `locale.messages` to translate any subset (unset keys keep their English defaults, exported as `DEFAULT_SANKEY_MESSAGES`). Visible tooltips are localized separately via `tooltipTemplate` / `nodeTooltipTemplate`.

| `SankeyMessages` key | Type | Description |
| --- | --- | --- |
| `diagramLabel` | `(ctx: SankeyDiagramLabelContext) => string` | SVG root aria-label summary (node/flow counts + largest flow). |
| `nodeAriaLabel` | `(ctx: SankeyNodeLabelContext) => string` | Per-node aria-label (incoming/outgoing flow summary). |
| `edgeAriaLabel` | `(ctx: SankeyEdgeLabelContext) => string` | Per-edge aria-label. Default: `Flow from {source} to {target}: {value} units`. |
| `nodesGroupLabel` | `string` | aria-label for the `<g>` wrapping all nodes. Default: `'Sankey nodes'`. |

```ts
const sankey = new ApexSankey(el, {
  locale: {
    direction: 'rtl',
    messages: {nodesGroupLabel: 'العقد'},
  },
});
```

Default tooltip template

```js
const tooltipTemplate = ({source, target, value}) => {
    return `
      <div style='display:flex;align-items:center;gap:5px;'>
        <div style='width:12px;height:12px;background-color:${source.color}'></div>
        <div>${source.title}</div>
        <div>=></div>
        <div style='width:12px;height:12px;background-color:${target.color}'></div>
        <div>${target.title}</div>
        <div>: ${value}</div>
      </div>
    `;
  },
```

### Expected data format

Passed data should be an object containing nodes, edges and options. Nodes, edges and options should be in below format.

- _nodes_ : Passed node object should contain id and title. _Id_ is for uniquely identifying nodes and _title_ is for node titles. It will be also used for showing tooltips for node-to-node connections.

```json
{
  "id": "1", // required
  "title": "A" // required
}
```

- _edges_ : Passed edge object should contain source, target, value and type. _source_ is id value of source node for edge, _target_ is id value of target node for edge, _value_ indicates edge size and _type_ is for grouping nodes.

```json
{
    "source": "a",    // required
    "target": "b",    // required
    "value": 1,       // required
    "type": "x",      // optional
},
```

- _options_ : ApexSankey supports two options order and alightLinkTypes.

  - _order_: optional list of layers

    If order is not specified, the nodes are automatically assigned to layers. If order is specified, it is used directly and no rank assignment or ordering algorithm takes place.

    The order structure has three nested lists: order is a list of layers, each of which is a list of bands, each of which is a list of node ids. For example,

    ```json
    {
        "order": [
            [["a", "b"]],
            [["c"]],
        ],
    },
    ```

**Example**

```js
const data = {
  nodes: [
    {
      id: 'a',
      title: 'AAA',
    },
    {
      id: 'b',
      title: 'BBB',
    },
    {
      id: 'c',
      title: 'CCC',
    },
  ],
  edges: [
    {
      source: 'a',
      target: 'c',
      value: 1,
      type: 'A',
    },
    {
      source: 'b',
      target: 'c',
      value: 2,
      type: 'A',
    },
  ],
  options: {
    order: [[['a', 'b']], [['c']]],
  },
};
```
