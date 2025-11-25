// 1. Enum экспортируется
export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

interface RequestOptions extends RequestInit {
    method: HttpMethod;
    headers?: HeadersInit;
    body?: string;
}

// 2. Класс экспортируется
export class RequestBuilder {
    private _url: string; //
    private options: RequestOptions;

    constructor() {
        this._url = '';
        this.options = { 
            method: HttpMethod.GET,
            headers: {}
        };
    }

    public url(urlValue: string): RequestBuilder {
        this._url = urlValue; // Используем _url
        return this;
    }

    public method(method: HttpMethod): RequestBuilder {
        this.options.method = method;
        return this;
    }

    public body(body: object | string): RequestBuilder {
        if (typeof body === 'object') {
            this.header('Content-Type', 'application/json');
            this.options.body = JSON.stringify(body);
        } else {
            this.options.body = body;
        }
        return this;
    }

    public header(key: string, value: string): RequestBuilder {
        if (!this.options.headers) {
            this.options.headers = {};
        }
        (this.options.headers as Record<string, string>)[key] = value;
        return this;
    }

    /**
     * Финальная функция, которая выполняет fetch-запрос.
     */
    public async exec(): Promise<Response> {
        if (!this._url) {
            throw new Error("URL не может быть пустым. Используйте .url() перед .exec().");
        }
        console.log(`Выполнение запроса: ${this.options.method} ${this._url}`);
        console.log(`Опции: ${JSON.stringify(this.options)}`);

        // Используем this._url для выполнения запроса
        return fetch(this._url, this.options);
    }
}