// 1. Используем enum для более безопасной работы с ключами или для статусов
enum UserKeys {
    ID = 'id',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    EMAIL = 'email'
}

// 2. Интерфейсы для типизации полученных данных
interface User {
    [UserKeys.ID]: number;
    [UserKeys.FIRST_NAME]: string;
    [UserKeys.LAST_NAME]: string;
    [UserKeys.EMAIL]: string;
    // Добавляем другие поля, которые могут быть в ответе, чтобы избежать ошибок
    age: number;
    gender: string;
    // ...
}

interface UserResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

const API_URL: string = 'https://dummyjson.com/users';

/**
 * Отправляет запрос на получение списка пользователей, выводит часть данных
 * и обрабатывает ошибки.
 */
async function fetchAndDisplayUsers(): Promise<void> {
    console.log('--- Отправка запроса ---');
    try {
        const response: Response = await fetch(API_URL);

        // Обработка HTTP-ошибок (статусы 4xx, 5xx)
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} (${response.statusText})`);
        }

        const data: UserResponse = await response.json();
        const users: User[] = data.users;

        console.log(`Получено пользователей: ${users.length}`);
        console.log('--- Вывод данных ---');
        
        users.slice(0, 5).forEach((user: User, index: number) => {
            console.log(
                `[${index + 1}] ID: ${user[UserKeys.ID]}, Имя: ${user[UserKeys.FIRST_NAME]} ${user[UserKeys.LAST_NAME]}, Email: ${user[UserKeys.EMAIL]}`
            );
        });

    } catch (error) {
        // Обработка ошибок сети, JSON-парсинга и явных исключений
        console.error('--- Ошибка исключения ---');
        // Убедимся, что выводим сообщение, если error - это объект Error
        if (error instanceof Error) {
            console.error(`Не удалось получить данные: ${error.message}`);
        } else {
            console.error('Произошла неизвестная ошибка.', error);
        }
    }
    console.log('--- Завершение операции ---');
}

// Вызов функции
fetchAndDisplayUsers();