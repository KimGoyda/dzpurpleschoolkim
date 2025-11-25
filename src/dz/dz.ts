'use strict';

// Типизация импортов исключена по запросу
declare function makeOrdinal(words: string): string;
declare function isFinite(num: number): boolean;
declare function isSafeNumber(num: number): boolean;

const TEN: number = 10;
const ONE_HUNDRED: number = 100;
const ONE_THOUSAND: number = 1000;
const ONE_MILLION: number = 1000000;
const ONE_BILLION: number = 1000000000;
const ONE_TRILLION: number = 1000000000000;
const ONE_QUADRILLION: number = 1000000000000000;
const MAX: number = 9007199254740992;

const LESS_THAN_TWENTY: string[] = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENTHS_LESS_THAN_HUNDRED: string[] = [
    'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param number
 * @param [asOrdinal]
 * @returns
 */
function toWords(number: number | string, asOrdinal?: boolean): string {
    let words: string;
    // num преобразуется в число с типом number, так как parseInt всегда возвращает number (или NaN)
    const num: number = parseInt(number as string, 10); 

    if (!isFinite(num)) {
        throw new TypeError(
            'Not a finite number: ' + number + ' (' + typeof number + ')'
        );
    }
    if (!isSafeNumber(num)) {
        throw new RangeError(
            'Input is not a safe number, it’s either too large or too small.'
        );
    }
    words = generateWords(num);
    return asOrdinal ? makeOrdinal(words) : words;
}

/**
 * Рекурсивная функция, которая генерирует словесное представление числа.
 * @param number Число, которое нужно преобразовать (абсолютное значение, так как знак обрабатывается в начале).
 * @param [words] Массив, используемый для накопления слов в рекурсии.
 * @returns Словесное представление числа.
 */
function generateWords(number: number, words?: string[]): string {
    let remainder: number;
    let word: string;
    
    // Аргументы arguments[1] используется только для совместимости с JS.
    // В TS лучше использовать явный параметр words.
    let currentWords: string[] | undefined = words;

    // We’re done
    if (number === 0) {
        if (!currentWords) {
            return 'zero';
        }
        return currentWords.join(' ').replace(/,$/, '');
    }
    
    // First run
    if (!currentWords) {
        currentWords = [];
    }

    // If negative, prepend “minus”
    if (number < 0) {
        currentWords.push('minus');
        number = Math.abs(number);
    }
    
    // Блок if-else должен быть охвачен для всех сценариев,
    // чтобы компилятор знал, что 'word' будет инициализировано.
    // Если number <= MAX, слово будет инициализировано.

    if (number < 20) {
        remainder = 0;
        word = LESS_THAN_TWENTY[number];

    } else if (number < ONE_HUNDRED) {
        remainder = number % TEN;
        word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
        
        if (remainder) {
            word += '-' + LESS_THAN_TWENTY[remainder];
            remainder = 0;
        }

    } else if (number < ONE_THOUSAND) {
        remainder = number % ONE_HUNDRED;
        word = generateWords(Math.floor(number / ONE_HUNDRED)) + ' hundred';

    } else if (number < ONE_MILLION) {
        remainder = number % ONE_THOUSAND;
        word = generateWords(Math.floor(number / ONE_THOUSAND)) + ' thousand,';

    } else if (number < ONE_BILLION) {
        remainder = number % ONE_MILLION;
        word = generateWords(Math.floor(number / ONE_MILLION)) + ' million,';

    } else if (number < ONE_TRILLION) {
        remainder = number % ONE_BILLION;
        word = generateWords(Math.floor(number / ONE_BILLION)) + ' billion,';

    } else if (number < ONE_QUADRILLION) {
        remainder = number % ONE_TRILLION;
        word = generateWords(Math.floor(number / ONE_TRILLION)) + ' trillion,';

    } else if (number <= MAX) {
        remainder = number % ONE_QUADRILLION;
        word = generateWords(Math.floor(number / ONE_QUADRILLION)) +
        ' quadrillion,';
    } else {
         // На случай, если number > MAX (хотя это должно быть отловлено isSafeNumber,
         // но для полной инициализации 'word' нужно что-то вернуть).
         // В данном контексте, благодаря isSafeNumber, эта ветка не должна быть достигнута.
         // Но для TS это необходимо.
         return currentWords.join(' ').replace(/,$/, '');
    }

    currentWords.push(word);
    return generateWords(remainder, currentWords);
}

// Модульный экспорт
module.exports = toWords;