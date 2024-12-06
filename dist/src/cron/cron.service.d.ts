import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
export declare class CronService {
    private config;
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(config: ConfigService, passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
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
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        };
        length: number;
        toString(): string;
        toLocaleString(): string;
        toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        pop(): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        } | undefined;
        push(...items: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]): number;
        concat(...items: ConcatArray<{
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>[]): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        concat(...items: ({
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        } | ConcatArray<{
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>)[]): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        join(separator?: string): string;
        reverse(): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        shift(): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        } | undefined;
        slice(start?: number, end?: number): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        sort(compareFn?: ((a: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, b: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }) => number) | undefined): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        splice(start: number, deleteCount?: number): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        splice(start: number, deleteCount: number, ...items: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        unshift(...items: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]): number;
        indexOf(searchElement: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, fromIndex?: number): number;
        every<S extends {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => U, thisArg?: any): U[];
        filter<S extends {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => value is S, thisArg?: any): S[];
        filter(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => unknown, thisArg?: any): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        reduce(callbackfn: (previousValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        };
        reduce(callbackfn: (previousValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, initialValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        };
        reduce<U>(callbackfn: (previousValue: U, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        };
        reduceRight(callbackfn: (previousValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, initialValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        };
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, currentIndex: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => U, initialValue: U): U;
        find<S extends {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => value is S, thisArg?: any): S | undefined;
        find(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => unknown, thisArg?: any): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        } | undefined;
        findIndex(predicate: (value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, obj: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, start?: number, end?: number): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        copyWithin(target: number, start: number, end?: number): {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[];
        entries(): ArrayIterator<[number, {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }]>;
        keys(): ArrayIterator<number>;
        values(): ArrayIterator<{
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }>;
        includes(searchElement: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, fromIndex?: number): boolean;
        flatMap<U, This = undefined>(callback: (this: This, value: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }, index: number, array: {
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        }[]) => U | readonly U[], thisArg?: This | undefined): U[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): ArrayIterator<{
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
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
            historyStatus: "FINISHED" | "EXPIRED" | "CANCEL";
            historyId: string;
        } | undefined;
    }[]>;
    deleteExpiredPassengerNotifications(): Promise<{
        id: string;
    }[]>;
    deleteExpiredRidderNotifications(): Promise<{
        id: string;
    }[]>;
}
