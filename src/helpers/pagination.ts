import { Repository } from "typeorm";
import { PAGINATE_PER_PAGE } from "src/config/constants";
import { Pagination } from "src/types/pagination.interface";

export async function paginate<ROType, EntityType extends {toResponseObject: Function}>(
    repository: Repository<EntityType>, 
    route: string,
    relations: string[] = [],
    page: number, 
    limit: number = PAGINATE_PER_PAGE,
): Promise<Pagination<ROType>> {
    const [items, totalItems] = await repository.findAndCount({
        relations,
        take: limit,
        skip: limit * (page - 1),
    });

    const itemsResponseObject: Array<ROType> = items.map(item => item.toResponseObject());
    const totalPages = 
        totalItems % limit === 0 
            ? totalItems / limit
            : Math.floor(totalItems / limit) + 1;

    return {
        items: itemsResponseObject,
        meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: totalItems,
            totalPages: totalPages,
        },
        links: {
            first: process.env.BASE_URL + route + '?page=1',
            last: process.env.BASE_URL + route + '?page=' + totalPages,
            next: page < totalPages ? (process.env.BASE_URL + route + '?page=' + (page + 1)) : null,
            previous: page > 1 ? (process.env.BASE_URL + route + '?page=' + (page - 1)) : null
        }
    };
}