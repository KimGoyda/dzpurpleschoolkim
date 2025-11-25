interface MapNode<K, V> {
    key: K;
    value: V;
    next: MapNode<K, V> | null;
}

type Bucket<K, V> = MapNode<K, V> | null;

class CustomMap<K, V> {
    private buckets: Bucket<K, V>[];
    private capacity: number;
    private size: number;

    constructor(initialCapacity: number = 10) {
        this.capacity = initialCapacity > 0 ? initialCapacity : 10;
        this.buckets = new Array(this.capacity).fill(null);
        this.size = 0;
    }


    private hash(key: K): number {
        // Преобразуем ключ в строку для вычисления хэша
        const keyString = String(key);
        let hashValue = 0;
        
        for (let i = 0; i < keyString.length; i++) {
            // Простая хэш-функция: сумма кодов символов
            hashValue = (hashValue + keyString.charCodeAt(i)) % this.capacity;
        }
        return hashValue;
    }


    public set(key: K, value: V): void {
        const index = this.hash(key);
        let current: MapNode<K, V> | null = this.buckets[index];
        

        while (current) {
            // Если ключ найден, обновляем значение и выходим
            if (current.key === key) {
                current.value = value;
                return;
            }
            current = current.next;
        }

        const newNode: MapNode<K, V> = { key, value, next: this.buckets[index] };
        this.buckets[index] = newNode;
        this.size++;

    }

    /**
     * Возвращает значение по ключу.
     */
    public get(key: K): V | undefined {
        const index = this.hash(key);
        let current = this.buckets[index];

        // Итерация по связанному списку
        while (current) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }

        // Ключ не найден
        return undefined;
    }

    /**
     * Удаляет элемент по ключу.
     */
    public delete(key: K): boolean {
        const index = this.hash(key);
        let current: MapNode<K, V> | null = this.buckets[index];
        let previous: MapNode<K, V> | null = null;

        while (current) {
            if (current.key === key) {
                // Если элемент — первый в списке (head)
                if (previous === null) {
                    this.buckets[index] = current.next;
                } else {
                    // Если элемент в середине или конце, перенаправляем ссылку
                    previous.next = current.next;
                }
                this.size--;
                return true;
            }
            previous = current;
            current = current.next;
        }

        // Ключ не найден
        return false;
    }

    /**
     * Очищает всю таблицу, удаляя все элементы.
     */
    public clear(): void {
        // Создаем новый пустой массив корзин и сбрасываем размер
        this.buckets = new Array(this.capacity).fill(null);
        this.size = 0;
        console.log("Map очищена.");
    }
    
    /**
     * Возвращает текущее количество элементов в Map.
     */
    public getSize(): number {
        return this.size;
    }
}