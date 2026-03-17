import { SankeyOptions } from '../../models/Options';
import { EdgeLabel, SankeyGraph } from '../types';

export declare function linkLayout(options: Partial<SankeyOptions>): (G: SankeyGraph) => EdgeLabel[];
