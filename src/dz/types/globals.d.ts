// types/globals.d.ts

declare module './makeOrdinal' {
    function makeOrdinal(words: string): string;
    export = makeOrdinal;
}

declare module './isFinite' {
    function isFinite(num: number): boolean;
    export = isFinite;
}

declare module './isSafeNumber' {
    function isSafeNumber(num: number): boolean;
    export = isSafeNumber;
}