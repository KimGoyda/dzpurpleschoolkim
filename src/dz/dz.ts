function allowFunc<T>(validatorFunc: (newValue: T) => boolean) {
    
    // Декоратор свойства
    return function (target: any, key: string | symbol) {
        
        let initialValue: T | undefined = target[key];

        // Внутренний ключ для хранения фактического значения на экземпляре
        const internalKey = `__${String(key)}`;

        Object.defineProperty(target, key, {
            
            // Геттер
            get: function (this: any): T {
                // Если внутреннее поле не инициализировано, инициализируем его начальным значением
                if (this[internalKey] === undefined) {
                     this[internalKey] = initialValue;
                }
                return this[internalKey];
            },

            // Сеттер
            set: function (this: any, newValue: T) {
                if (validatorFunc(newValue)) {
                    this[internalKey] = newValue;
                } else {
                    console.warn(`[${String(key)}]: Присваивание значения ${newValue} отклонено валидатором.`);
                }
            },
            enumerable: true,
            configurable: true
        });
    };
}

class User {
    // Начальное значение 30 будет сохранено и использовано при первом доступе
    @allowFunc<number>((a: number) => a > 0)
    age: number = 30; 

    @allowFunc<string>((s: string) => s.length >= 5)
    name: string = "Alice Johnson";
}

// --- Тестирование ---
const person = new User();

// 1. Первый console.log теперь возвращает 30
console.log(`Начальный возраст (должен быть 30): ${person.age}`); 

// 2. Попытка присвоить невалидное значение (0 <= 0)
person.age = 0; 
console.log(`Текущий возраст (должен быть 30): ${person.age}`); 

// 3. Попытка присвоить валидное значение (20 > 0)
person.age = 20;
console.log(`Текущий возраст (должен быть 20): ${person.age}`);
