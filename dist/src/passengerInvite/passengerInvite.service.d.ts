import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerInviteService {
    private db;
    constructor(db: DrizzleDB);
    createPassengerInviteByOrderId(inviterId: string, orderId: string, createPassengerInviteDto: CreatePassengerInviteDto): Promise<{
        id: string;
        orderId: string;
        createdAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    getPassengerInviteById(id: string, userId: string): Promise<{
        id: string;
        suggestPrice: number;
        inviteBriefDescription: string | null;
        suggestStartCord: {
            x: number;
            y: number;
        };
        suggestEndCord: {
            x: number;
            y: number;
        };
        suggestStartAfter: Date;
        inviteCreatedAt: Date;
        inviteUdpatedAt: Date;
        inviteStatus: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        initPrice: number | null;
        startCord: {
            x: number;
            y: number;
        } | null;
        endCord: {
            x: number;
            y: number;
        } | null;
        description: string | null;
        startAfter: Date | null;
        orderCreatedAt: Date | null;
        orderUpdatedAt: Date | null;
        creatorName: string | null;
        isOnline: boolean | null;
        avatorUrl: string | null;
        motocycleLicense: string | null;
        motocycleType: string | null;
        motocyclePhotoUrl: string | null;
        phoneNumber: string | null;
    }[]>;
    searchPaginationPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    searchPaginationPasssengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByReceverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    updatePassengerInviteById(id: string, inviterId: string, updatePassengerInviteDto: UpdatePassengerInviteDto): Promise<{
        id: string;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    decidePassengerInviteById(id: string, receiverId: string, decidePassengerInviteDto: DecidePassengerInviteDto): Promise<import("pg").QueryResult<never> | {
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        price: number;
        passengerStartCord: {
            x: number;
            y: number;
        };
        passengerEndCord: {
            x: number;
            y: number;
        };
        ridderStartCord: {
            x: number;
            y: number;
        };
        startAfter: Date;
        orderStatus: "UNSTARTED" | "STARTED";
    }>;
    deletePassengerInviteById(id: string, inviterId: string): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
}
