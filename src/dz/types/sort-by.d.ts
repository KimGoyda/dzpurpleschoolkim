
type Comparator<T> = (a: T, b: T) => number;


type SortField<T> = keyof T | ((item: T) => any) | string;

declare module 'sort-by' {
    function sortBy<T>(
        ...fields: SortField<T>[]
    ): Comparator<T>;

    export = sortBy;
}