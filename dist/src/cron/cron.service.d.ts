import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class CronService {
    private config;
    private db;
    constructor(config: ConfigService, db: DrizzleDB);
    updateToExpiredPurchaseOrders(): Promise<{
        id: string;
    }[]>;
    updateToExpiredSupplyOrders(): Promise<{
        id: string;
    }[]>;
    updateToExpiredPassengerInvites(): Promise<{
        id: string;
    }[]>;
    updateToExpiredRidderInvites(): Promise<{
        id: string;
    }[]>;
    updateToStartedOrders(): Promise<{
        id: string;
    }[]>;
    deleteExpiredPurchaseOrders(): Promise<{
        id: string;
    }[]>;
    deleteExpiredSupplyOrders(): Promise<{
        id: string;
    }[]>;
    deleteExpiredPassengerInvites(): Promise<{
        id: string;
    }[]>;
    deleteExpiredRidderInvites(): Promise<{
        id: string;
    }[]>;
    deleteExpiredOrders(): Promise<{
        [x: number]: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        };
        length: number;
        toString(): string;
        toLocaleString(): string;
        toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        pop(): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        } | undefined;
        push(...items: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]): number;
        concat(...items: ConcatArray<{
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>[]): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        concat(...items: ({
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        } | ConcatArray<{
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>)[]): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        join(separator?: string): string;
        reverse(): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        shift(): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        } | undefined;
        slice(start?: number, end?: number): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        sort(compareFn?: ((a: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, b: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }) => number) | undefined): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        splice(start: number, deleteCount?: number): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        splice(start: number, deleteCount: number, ...items: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        unshift(...items: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]): number;
        indexOf(searchElement: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, fromIndex?: number): number;
        every<S extends {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => U, thisArg?: any): U[];
        filter<S extends {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => value is S, thisArg?: any): S[];
        filter(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => unknown, thisArg?: any): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        reduce(callbackfn: (previousValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        };
        reduce(callbackfn: (previousValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, initialValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        };
        reduce<U>(callbackfn: (previousValue: U, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        };
        reduceRight(callbackfn: (previousValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, initialValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        };
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => U, initialValue: U): U;
        find<S extends {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => value is S, thisArg?: any): S | undefined;
        find(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => unknown, thisArg?: any): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        } | undefined;
        findIndex(predicate: (value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, start?: number, end?: number): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        copyWithin(target: number, start: number, end?: number): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[];
        entries(): ArrayIterator<[number, {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }]>;
        keys(): ArrayIterator<number>;
        values(): ArrayIterator<{
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>;
        includes(searchElement: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, fromIndex?: number): boolean;
        flatMap<U, This = undefined>(callback: (this: This, value: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }, index: number, array: {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }[]) => U | readonly U[], thisArg?: This | undefined): U[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): ArrayIterator<{
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        }>;
        [Symbol.unscopables]: {
            [x: number]: boolean | undefined;
            length?: boolean | undefined;
            toString?: boolean | undefined;
            toLocaleString?: boolean | undefined;
            pop?: boolean | undefined;
            push?: boolean | undefined;
            concat?: boolean | undefined;
            join?: boolean | undefined;
            reverse?: boolean | undefined;
            shift?: boolean | undefined;
            slice?: boolean | undefined;
            sort?: boolean | undefined;
            splice?: boolean | undefined;
            unshift?: boolean | undefined;
            indexOf?: boolean | undefined;
            lastIndexOf?: boolean | undefined;
            every?: boolean | undefined;
            some?: boolean | undefined;
            forEach?: boolean | undefined;
            map?: boolean | undefined;
            filter?: boolean | undefined;
            reduce?: boolean | undefined;
            reduceRight?: boolean | undefined;
            find?: boolean | undefined;
            findIndex?: boolean | undefined;
            fill?: boolean | undefined;
            copyWithin?: boolean | undefined;
            entries?: boolean | undefined;
            keys?: boolean | undefined;
            values?: boolean | undefined;
            includes?: boolean | undefined;
            flatMap?: boolean | undefined;
            flat?: boolean | undefined;
            [Symbol.iterator]?: boolean | undefined;
            readonly [Symbol.unscopables]?: boolean | undefined;
            at?: boolean | undefined;
        };
        at(index: number): {
            historyStatus: "EXPIRED" | "CANCEL" | "FINISHED";
            historyId: string;
        } | undefined;
    }[]>;
}
