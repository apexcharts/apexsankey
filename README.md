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

## ApexSankey Options

The layout can be configured by passing a second argument to `ApexSankey` with the properties listed below.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | `'100%'` | Width of the canvas. Accepts a pixel number or CSS percentage string. |
| `height` | `number \| string` | `'auto'` | Height of the canvas. `'auto'` derives height from width at a 1.6:1 ratio. |
| `canvasStyle` | `string` | built-in border | Arbitrary CSS injected onto the SVG root container element. |
| `spacing` | `number` | `20` | Horizontal spacing between node columns in pixels. |
| `nodeWidth` | `number` | `20` | Width of each node rectangle in pixels. |
| `nodeBorderWidth` | `number` | `1` | Border width of each node in pixels. |
| `nodeBorderColor` | `string \| null` | `null` | CSS color for the node border. `null` disables the border. |
| `onNodeClick` | `(node: SankeyNode) => void` | `undefined` | Callback fired when the user clicks a node. |
| `edgeOpacity` | `number` | `0.4` | Opacity of edges (0–1). |
| `edgeGradientFill` | `boolean` | `true` | Fill edges with a gradient between source and target node colors. |
| `edgeGap` | `number` | `2` | Gap in pixels between adjacent edges at node connection points. |
| `whitespace` | `number` | `0.18` | Fraction of vertical space used as margins between nodes (0–1). Lower = taller nodes. |
| `viewPortWidth` | `number` | `800` | Internal SVG viewport width in pixels. |
| `viewPortHeight` | `number` | `500` | Internal SVG viewport height in pixels. |
| `highlightConnectedPath` | `boolean` | `true` | Highlight the connected flow path when hovering a node or edge. |
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

  - _alignLinkTypes_: boolean (default false). Whether to align link types across nodes, or order links to minimise crossings.

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
