type Swap<T extends Record<PropertyKey, PropertyKey>> = {
    [V in T[keyof T]]: { 
        [K in keyof T]: T[K] extends V ? K : never 
    }[keyof T] extends infer Key ? Key : never
};


function swapKeysAndValues<
    K extends PropertyKey, 
    V extends PropertyKey, 
    T extends Record<K, V>
>(obj: T): Swap<T> {
    const invertedObj: any = {};
    
    // Итерация по ключам входного объекта
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            invertedObj[value] = key;
        }
    }
    
    // Возвращаем объект, приведенный к сложному инвертированному типу
    return invertedObj as Swap<T>;
}

// Пример использования:
const obj = {
  a: 1,
  b: 2
};

const res = swapKeysAndValues(obj); 

console.log(res);