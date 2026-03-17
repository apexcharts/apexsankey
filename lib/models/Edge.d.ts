import { EdgeLabel } from '../layout/types';

/** Minimal edge shape needed for geometry calculations */
interface EdgeSegment {
    dy: number;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    r0?: number;
    r1?: number;
    d0?: string;
    d1?: string;
}
export declare function segmentPath(edge: EdgeSegment): string;
export declare function generatePath(d: EdgeLabel): string | null;
export {};
