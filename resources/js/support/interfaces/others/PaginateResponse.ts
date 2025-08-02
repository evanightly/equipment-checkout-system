import { PaginateMeta } from './PaginateMeta';

export interface PaginateResponse<Resource> extends PaginateMeta {
    data?: Resource[];
}
