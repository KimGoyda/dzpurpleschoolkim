type DifferenceType<T, U> = Omit<T, keyof U>;

function difference<T extends Record<string, any>, U extends Record<string, any>>(
    objA: T, 
    objB: U
): DifferenceType<T, U> {
    const keysToRemove: (keyof U)[] = Object.keys(objB) as (keyof U)[];
    const result = { ...objA };

    for (const key of keysToRemove) {
        if (key in result) {
            // Удаляем свойство
            delete result[key as keyof typeof result];
        }
    }

    return result as DifferenceType<T, U>;
}


interface IA {
  a: number;
  b: string;
}

interface IB {
  a: number;
  c: boolean;
}

interface IDifference {
  b: string;
}

let a: IA = { a: 5, b: 'hello' };
let b: IB = { a: 10, c: true };

let v0: IDifference = difference(a, b) as IDifference;

console.log(v0);