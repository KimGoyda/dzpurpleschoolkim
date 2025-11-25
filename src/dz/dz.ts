interface Item {
    id: number;
    date: string;
    title: string;
}

type SortKey = 'id' | 'date';

class ItemIterator implements IterableIterator<Item> {
    private items: Item[];
    private position: number;

    constructor(items: Item[], sortKey: SortKey) {
        // Клонируем и сортируем массив, чтобы не менять исходный порядок
        this.items = [...items];
        this.position = 0;

        // Определяем логику сортировки
        if (sortKey === 'id') {
            this.items.sort((a, b) => a.id - b.id);
        } else if (sortKey === 'date') {
            // Сортировка по строковой дате (для простой демонстрации)
            this.items.sort((a, b) => a.date.localeCompare(b.date));
        }
    }

    /**
     * Возвращает сам объект итератора (требование протокола Iterable)
     */
    [Symbol.iterator](): IterableIterator<Item> {
        return this;
    }

    /**
     * Основной метод итератора: возвращает следующий элемент.
     */
    next(): IteratorResult<Item> {
        if (this.position < this.items.length) {
            return {
                value: this.items[this.position++],
                done: false,
            };
        } else {
            return {
                value: undefined,
                done: true,
            };
        }
    }
}

class ItemCollection implements Iterable<Item> {
    private items: Item[] = [];

    constructor(initialItems: Item[] = []) {
        this.items = initialItems;
    }

    public addItem(item: Item): void {
        this.items.push(item);
    }

    /**
     * Метод, который позволяет получить итератор с указанным критерием обхода.
     * Реализует протокол Iterable для обхода по умолчанию (по 'id').
     */
    [Symbol.iterator](): ItemIterator {
        return this.getIterator('id');
    }

    public getIterator(sortKey: SortKey): ItemIterator {
        return new ItemIterator(this.items, sortKey);
    }
}