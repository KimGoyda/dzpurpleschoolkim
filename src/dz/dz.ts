
type Comparator<T> = (a: T, b: T) => number;

type SortField<T, K extends keyof T> = K | keyof T | ((item: T) => any) | string;

declare function sortBy<T, K extends keyof T = keyof T>(
    ...fields: SortField<T, K>[]
): Comparator<T>;

export = sortBy;