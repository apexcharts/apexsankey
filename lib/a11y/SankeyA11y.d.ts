import { PathHighlighter } from '../models/PathHighlighter';
import { SankeyGraph } from '../layout/types';

/** ARIA / accessibility options passed from SankeyOptions.a11y */
export interface A11yOptions {
    enabled?: boolean;
    diagramLabel?: string;
    description?: string;
}
/**
 * Injects WCAG 2.1 AA accessibility attributes into a rendered Sankey diagram:
 *  - ARIA roles and labels on the SVG root, node groups, and edge paths
 *  - `<title>` and optional `<desc>` elements inside the SVG
 *  - Keyboard navigation (Enter / Space to activate, Escape to dismiss)
 *  - Visible focus ring via JS (robust across browsers)
 *  - `forced-colors` CSS class on the SVG root when the system is in High Contrast Mode
 */
export declare class SankeyA11y {
    private readonly svgEl;
    private readonly graph;
    private readonly options;
    private readonly tooltipId?;
    private readonly pathHighlighter?;
    private nodeGroups;
    private edgePaths;
    /** Maps node id → its outgoing edge paths, in DOM order */
    private nodeOutEdges;
    /** Maps edge element → source node id (for Escape-to-return) */
    private edgeSourceNode;
    private mediaQuery;
    private forcedColorsHandler;
    private isKeyboardUser;
    constructor(svgEl: SVGSVGElement, graph: SankeyGraph, options?: A11yOptions, tooltipId?: string | undefined, pathHighlighter?: PathHighlighter | null | undefined);
    /** Apply all accessibility enhancements. Safe to call on every render. */
    apply(): void;
    /**
     * Remove media-query listener. Should be called before the diagram is
     * destroyed or before a new SankeyA11y is created for the same SVG.
     */
    destroy(): void;
    private injectAriaAttributes;
    private setupKeyboardNavigation;
    private hideTooltip;
    /**
     * Applies a visible focus ring by overriding the rect's stroke attributes.
     * More reliable than CSS outline on SVG elements across all browsers.
     */
    private applyFocusRing;
    private restoreFocusRing;
    private setupHighContrastMode;
}
