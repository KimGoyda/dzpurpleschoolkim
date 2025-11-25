
function allowFunc<T>(validatorFunc: (newValue: T) => boolean) {
    // Декоратор свойства принимает target (класс), key (имя свойства)
    return function (target: any, key: string | symbol) {
        
        // Внутреннее приватное поле для хранения фактического значения
        const internalKey = `__${String(key)}`;

        // Создаем геттер и сеттер для свойства, используя Object.defineProperty
        Object.defineProperty(target, key, {
            
            // Геттер: возвращает значение из внутреннего поля
            get: function () {
                return this[internalKey];
            },

            set: function (newValue: T) {
                if (validatorFunc(newValue)) {
                    this[internalKey] = newValue;
                } else {
                    // Опционально: вывод предупреждения, если присваивание отклонено
                    console.warn(`[${String(key)}]: Присваивание значения ${newValue} отклонено валидатором.`);
                }
            },
            enumerable: true,
            configurable: true
        });
    };
}

class User {
    // Применяем декоратор: позволяет присваивание, только если a > 0
    @allowFunc<number>((a: number) => a > 0)
    age: number = 30; // Инициализация происходит до применения декоратора set

    @allowFunc<string>((s: string) => s.length >= 5)
    name: string = "Alice";
}

// --- Тестирование ---
const person = new User();

// Начальное значение
console.log(`Начальный возраст: ${person.age}`); // 30
console.log(`Начальное имя: ${person.name}`);    // Alice

console.log('\nПопытка присвоить 0 (невалидно):');
person.age = 0; 
console.log(`Текущий возраст: ${person.age}`); // 30 (не изменилось)

console.log('\nПопытка присвоить "Bob" (длина < 5):');
person.name = "Bob";
console.log(`Текущее имя: ${person.name}`); // Alice (не изменилось)

console.log('\nПопытка присвоить 20 (валидно):');
person.age = 20;
console.log(`Текущий возраст: ${person.age}`); // 20

console.log('\nПопытка присвоить "Charlie" (валидно):');
person.name = "Charlie";
console.log(`Текущее имя: ${person.name}`); // Charlie