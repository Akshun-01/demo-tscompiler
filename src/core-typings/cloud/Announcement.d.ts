import type { IBanner } from '../IBanner';
export interface Announcement extends IBanner {
    selector?: {
        roles?: string[];
    };
}
