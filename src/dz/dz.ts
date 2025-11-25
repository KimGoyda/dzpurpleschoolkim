
function pickObjectKeys<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        // Проверяем наличие ключа в объекте перед присвоением
        if (key in obj) {
            result[key] = obj[key];
        }
    }

    return result;
}

// Пример использования:
interface User {
  name: string;
  age: number;
  skills: string[];
}

const user: User = {
  name: "Vasiliy",
  age: 8,
  skills: ['typescript', 'javascript']
};

const res = pickObjectKeys(user, ['age', 'skills']);

console.log('--- Результат 1 ---');
console.log(res);

const res2 = pickObjectKeys(user, ['name']);
console.log('\n--- Результат 2 ---');
console.log(res2);