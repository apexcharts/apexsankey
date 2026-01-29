/**
 * Original, full-width node positioning.
 *
 * Uses spacing and whitespace fraction to position nodes within layers.
 *
 * @module node-positioning/justified
 */
export declare function justifiedPositioning(): {
    (G: any, order: any, edgeGap?: number): any[];
    scaleToFit(G: any, order: any, edgeGap?: number): void;
    size(x?: any): number[] | any;
    separation(x?: any): ((a: any, b: any, c: any) => number) | any;
    whitespace(x?: number): number | any;
    scale(x?: number): any;
};
