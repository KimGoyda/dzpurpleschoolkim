// 1. Enum для строгой типизации методов запроса
enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

// 2. Интерфейс для финальных опций fetch
interface RequestOptions extends RequestInit {
    method: HttpMethod;
    headers?: HeadersInit;
    body?: string;
}

class RequestBuilder {
    private url: string;
    private options: RequestOptions;

    constructor() {
        // Инициализация базовых опций
        this.url = '';
        this.options = { 
            method: HttpMethod.GET,
            headers: {}
        };
    }

    public url(url: string): RequestBuilder {
        this.url = url;
        return this; // Возвращаем this для цепочки вызовов
    }

    public method(method: HttpMethod): RequestBuilder {
        this.options.method = method;
        return this;
    }

    public body(body: object | string): RequestBuilder {
        if (typeof body === 'object') {
            // Если это объект, устанавливаем заголовок Content-Type и сериализуем
            this.header('Content-Type', 'application/json');
            this.options.body = JSON.stringify(body);
        } else {
            this.options.body = body;
        }
        return this;
    }

    public header(key: string, value: string): RequestBuilder {
        // Проверяем, что headers — это объект
        if (!this.options.headers) {
            this.options.headers = {};
        }
        // Добавляем заголовок
        (this.options.headers as Record<string, string>)[key] = value;
        return this;
    }

    public async exec(): Promise<Response> {
        if (!this.url) {
            throw new Error("URL не может быть пустым. Используйте .url() перед .exec().");
        }
        console.log(`Выполнение запроса: ${this.options.method} ${this.url}`);
        console.log(`Опции: ${JSON.stringify(this.options)}`);

        // Выполняем fetch с собранными опциями
        return fetch(this.url, this.options);
    }
}