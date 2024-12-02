import { DrizzleDB } from '../../src/drizzle/types/drizzle';
import { CreatePurchaseOrderDto } from './dto/create-purchaseOrder.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchaseOrder.dto';
import { GetAdjacentPurchaseOrdersDto, GetSimilarRoutePurchaseOrdersDto } from './dto/get-purchaseOrder.dto';
import { AcceptAutoAcceptPurchaseOrderDto } from './dto/accept-purchaseOrder-dto';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
export declare class PurchaseOrderService {
    private notification;
    private db;
    constructor(notification: PassengerNotificationService, db: DrizzleDB);
    private updateExpiredPurchaseOrders;
    createPurchaseOrderByCreatorId(creatorId: string, createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<{
        [x: number]: {
            notificationType: "PurchaseOrder" | "SupplyOrder" | "PassengerInvite" | "RidderInvite" | "Order" | "History" | "Payment" | "System";
            id: string;
            userId: string;
            title: string;
            description: string | null;
            linkId: string | null;
            isRead: boolean;
            createdAt: Date;
        } | {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        };
        length: number;
        toString(): string;
        toLocaleString(): string;
        toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        pop(): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        } | undefined;
        push(...items: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]): number;
        concat(...items: ConcatArray<{
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>[]): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        concat(...items: ({
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        } | ConcatArray<{
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>)[]): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        join(separator?: string): string;
        reverse(): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        shift(): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        } | undefined;
        slice(start?: number, end?: number): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        sort(compareFn?: ((a: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, b: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }) => number) | undefined): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        splice(start: number, deleteCount?: number): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        splice(start: number, deleteCount: number, ...items: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        unshift(...items: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]): number;
        indexOf(searchElement: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, fromIndex?: number): number;
        lastIndexOf(searchElement: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, fromIndex?: number): number;
        every<S extends {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => U, thisArg?: any): U[];
        filter<S extends {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => value is S, thisArg?: any): S[];
        filter(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => unknown, thisArg?: any): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        reduce(callbackfn: (previousValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        };
        reduce(callbackfn: (previousValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, initialValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        };
        reduce<U>(callbackfn: (previousValue: U, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        };
        reduceRight(callbackfn: (previousValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, initialValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        };
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, currentIndex: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => U, initialValue: U): U;
        find<S extends {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, obj: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => value is S, thisArg?: any): S | undefined;
        find(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, obj: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => unknown, thisArg?: any): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        } | undefined;
        findIndex(predicate: (value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, obj: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, start?: number, end?: number): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        copyWithin(target: number, start: number, end?: number): {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[];
        entries(): ArrayIterator<[number, {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }]>;
        keys(): ArrayIterator<number>;
        values(): ArrayIterator<{
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }>;
        includes(searchElement: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, fromIndex?: number): boolean;
        flatMap<U, This = undefined>(callback: (this: This, value: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }, index: number, array: {
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        }[]) => U | readonly U[], thisArg?: This | undefined): U[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): ArrayIterator<{
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
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
            id: string;
            status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        } | undefined;
    }>;
    searchPurchaseOrdersByCreatorId(creatorId: string, limit: number, offset: number, isAutoAccept: boolean): Promise<{
        id: string;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        startAfter: Date;
        endedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    getPurchaseOrderById(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        startAfter: Date;
        endedAt: Date;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        isUrgent: boolean;
        creator: {
            userName: string;
            info: {
                isOnline: boolean;
                avatorUrl: string | null;
            } | null;
        };
    } | undefined>;
    searchPaginationPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    searchAboutToStartPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    searchCurAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchDestAdjacentPurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getAdjacentPurchaseOrdersDto: GetAdjacentPurchaseOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        manhattanDistance: unknown;
    }[]>;
    searchSimilarRoutePurchaseOrders(creatorName: string | undefined, limit: number, offset: number, isAutoAccept: boolean, getSimilarRoutePurchaseOrdersDto: GetSimilarRoutePurchaseOrdersDto): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: string | null;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        RDV: unknown;
    }[]>;
    updatePurchaseOrderById(id: string, creatorId: string, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    startPurchaseOrderWithoutInvite(id: string, userId: string, acceptAutoAcceptPurchaseOrderDto: AcceptAutoAcceptPurchaseOrderDto): Promise<{
        orderId: string;
        price: number;
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
        startAfter: Date;
        endedAt: Date;
        orderStatus: "FINISHED" | "UNSTARTED" | "STARTED" | "UNPAID";
    }[]>;
    deletePurchaseOrderById(id: string, creatorId: string): Promise<{
        id: string;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
    getAllPurchaseOrders(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        creatorId: string;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        startAfter: Date;
        endedAt: Date;
        autoAccept: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
        isUrgent: boolean;
    }[]>;
    searchPaginationPurchaseOrdersWithUpdateExpired(updateExpiredData: boolean, userName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        creatorName: string | null;
        avatorUrl: never;
        initPrice: number;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        startAddress: string;
        endAddress: string;
        createdAt: Date;
        updatedAt: Date;
        startAfter: Date;
        endedAt: Date;
        isUrgent: boolean;
        status: "EXPIRED" | "CANCEL" | "POSTED" | "RESERVED";
    }[]>;
}
