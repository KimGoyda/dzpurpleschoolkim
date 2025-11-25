// Интерфейс для продукта, который мы ожидаем получить
interface Product {
    id: number;
    title: string;
    price: number;
}

// 1. Интерфейс (Контракт)
interface ProductService {
    getProduct(id: number): Promise<Product | { error: string }>;
}

// 2. Реальный объект (Subject)
class RealAPI implements ProductService {
    private readonly baseUrl: string = 'https://dummyjson.com/products/';

    public async getProduct(id: number): Promise<Product> {
        console.log(`[API] Отправка запроса на: ${this.baseUrl}${id}`);
        const response = await fetch(`${this.baseUrl}${id}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }
        
        const data: Product = await response.json();
        return data;
    }
}

// 3. Прокси-объект (Proxy)
class ProductServiceProxy implements ProductService {
    // Прокси содержит ссылку на реальный объект
    private realApi: RealAPI;
    
    constructor(realApi: RealAPI) {
        this.realApi = realApi;
    }

    public async getProduct(id: number): Promise<Product | { error: string }> {
        console.log(`[PROXY] Получен запрос на продукт ID: ${id}`);
        
        // --- Логика Проверки (Защитник/Прокси-логика) ---
        if (id >= 10) {
            console.warn(`[PROXY] Запрос отклонен: ID ${id} превышает лимит 10.`);
            return { error: `ID продукта (${id}) превышает допустимый лимит (10).` };
        }
        
        // --- Делегирование ---
        try {
            // Если проверка пройдена, делегируем вызов реальному объекту
            const product = await this.realApi.getProduct(id);
            console.log(`[PROXY] Успешный ответ для ID ${id}.`);
            return product;
        } catch (error) {
            // Обработка ошибок, возникших в реальном API
            const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка API";
            return { error: `Ошибка API: ${errorMessage}` };
        }
    }
}

// --- Использование ---
const realApi = new RealAPI();
// Клиент взаимодействует только с Прокси, используя контракт ProductService
const serviceProxy: ProductService = new ProductServiceProxy(realApi);

async function runTest(productId: number) {
    console.log(`\n==== Тест ID: ${productId} ====`);
    const result = await serviceProxy.getProduct(productId);
    
    if ('error' in result) {
        console.error(`Результат: ${result.error}`);
    } else {
        console.log(`Результат: ${result.title} (Цена: $${result.price})`);
    }
}

// 1. Запрос, который пройдет проверку (id < 10)
runTest(5); 

// 2. Запрос, который будет отклонен Прокси (id >= 10)
runTest(15);

// 3. Крайний случай
runTest(9);