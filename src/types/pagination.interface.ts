export interface Pagination<T> {
    items: Array<T>;
    meta: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
    };
    links: {
        first: string;
        last: string;
        next: string | null;
        previous: string | null;
    }
}