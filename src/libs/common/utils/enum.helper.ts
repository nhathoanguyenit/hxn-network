export interface Enum {
    values: () => string[];
}

export class EnumHelper<T> {
    public static create<T>(definition: T): T & Enum {
        const enumObject = { ...definition };

        (enumObject as any).values = function () {
            return Object.values(definition as any);
        };

        return Object.freeze(enumObject) as any;
    }
}
