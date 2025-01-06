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
    signInPassengerAdmin(): Promise<{
        isAdmin: boolean;
    }>;
    signInRidderAdmin(): Promise<{
        isAdmin: boolean;
    }>;
    createPurchaseOrdersByPeriodicPurchaseOrders(): Promise<{
        periodicPurchaseOrderId: string;
        purchaseOrderId: string;
    }[] | {
        id: string;
    }[]>;
    createSupplyOrdersByPeriodicSupplyOrders(): Promise<{
        periodicSupplyOrderId: string;
        supplyOrderId: string;
    }[] | {
        id: string;
    }[]>;
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
    }[] | {
        [x: number]: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        };
        length: number;
        toString(): string;
        toLocaleString(): string;
        toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        pop(): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        } | undefined;
        push(...items: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]): number;
        concat(...items: ConcatArray<{
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>[]): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        concat(...items: ({
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        } | ConcatArray<{
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>)[]): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        join(separator?: string): string;
        reverse(): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        shift(): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        } | undefined;
        slice(start?: number, end?: number): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        sort(compareFn?: ((a: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, b: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }) => number) | undefined): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        splice(start: number, deleteCount?: number): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        splice(start: number, deleteCount: number, ...items: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        unshift(...items: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]): number;
        indexOf(searchElement: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, fromIndex?: number): number;
        every<S extends {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => U, thisArg?: any): U[];
        filter<S extends {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => value is S, thisArg?: any): S[];
        filter(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => unknown, thisArg?: any): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        reduce(callbackfn: (previousValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        };
        reduce(callbackfn: (previousValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, initialValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        };
        reduce<U>(callbackfn: (previousValue: U, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        };
        reduceRight(callbackfn: (previousValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, initialValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        };
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, currentIndex: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => U, initialValue: U): U;
        find<S extends {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, obj: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => value is S, thisArg?: any): S | undefined;
        find(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, obj: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => unknown, thisArg?: any): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        } | undefined;
        findIndex(predicate: (value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, obj: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, start?: number, end?: number): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        copyWithin(target: number, start: number, end?: number): {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[];
        entries(): ArrayIterator<[number, {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }]>;
        keys(): ArrayIterator<number>;
        values(): ArrayIterator<{
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }>;
        includes(searchElement: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, fromIndex?: number): boolean;
        flatMap<U, This = undefined>(callback: (this: This, value: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }, index: number, array: {
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        }[]) => U | readonly U[], thisArg?: This | undefined): U[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): ArrayIterator<{
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
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
            startAfter: Date;
            endedAt: Date;
            passengerId: string;
            ridderId: string;
            prevOrderId: string;
            finalPrice: number;
            passengerDescription: string | null;
            ridderDescription: string | null;
            finalStartCord: {
                x: number;
                y: number;
            };
            finalEndCord: {
                x: number;
                y: number;
            };
            finalStartAddress: string;
            finalEndAddress: string;
        } | undefined;
    }[]>;
    deleteExpiredPassengerNotifications(): Promise<{
        id: string;
    }[]>;
    deleteExpiredRidderNotifications(): Promise<{
        id: string;
    }[]>;
}
