import { SankeyOptions } from '../models/Options';

/**
 * Reads a CSS custom property value from an element using getComputedStyle.
 * Returns an empty string if the property is not set.
 */
export declare function readCSSVar(element: HTMLElement, name: string): string;
/**
 * Resolves SankeyOptions by overriding JS option values with CSS custom property
 * values when those properties are set on the container element.
 *
 * Supported CSS custom properties:
 *   --apex-sankey-edge-opacity        → edgeOpacity
 *   --apex-sankey-edge-gradient       → edgeGradientFill (boolean: 'true'/'false')
 *   --apex-sankey-label-color         → fontColor
 *   --apex-sankey-label-font-size     → fontSize
 *   --apex-sankey-font-family         → fontFamily
 *   --apex-sankey-node-width          → nodeWidth
 *   --apex-sankey-node-border-color   → nodeBorderColor
 *   --apex-sankey-node-border-width   → nodeBorderWidth
 *   --apex-sankey-tooltip-bg          → tooltipBGColor
 *   --apex-sankey-tooltip-border-color → tooltipBorderColor
 *   --apex-sankey-tooltip-font-color  → tooltipFontColor
 *   --apex-sankey-tooltip-theme       → tooltipTheme ('light' | 'dark')
 *
 * CSS custom properties take precedence over JS options.
 * JS options serve as fallbacks when no CSS variable is present.
 */
export declare function resolveCSSVars(element: HTMLElement, options: SankeyOptions): SankeyOptions;
