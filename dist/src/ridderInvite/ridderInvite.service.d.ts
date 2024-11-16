import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class RidderInviteService {
    private db;
    constructor(db: DrizzleDB);
    createRidderInviteByOrderId(inviterId: string, orderId: string, createRidderInviteDto: CreateRidderInviteDto): Promise<{
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        id: string;
        createdAt: Date;
        orderId: string;
    }[]>;
    getRidderInviteById(id: string, userId: string): Promise<{
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
        suggestStartAddress: string;
        suggestEndAddress: string;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
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
        startAddress: string | null;
        endAddress: string | null;
        description: string | null;
        startAfter: Date | null;
        endedAt: Date | null;
        orderCreatedAt: Date | null;
        orderUpdatedAt: Date | null;
        creatorName: string | null;
        isOnline: boolean | null;
        avatorUrl: string | null;
        phoneNumber: string | null;
    }[]>;
    searchPaginationRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        startAddress: never;
        endAddress: never;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        endedAt: never;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        startAddress: never;
        endAddress: never;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        endedAt: never;
        suggetStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        startAddress: never;
        endAddress: never;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        endedAt: never;
        suggetStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRouteRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        startAddress: never;
        endAddress: never;
        receiverName: never;
        avatorUrl: never;
        initPrice: never;
        suggestPrice: number;
        startAfter: never;
        endedAt: never;
        suggetStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    searchPaginationRidderInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        endedAt: Date | null;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentRidderInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        endedAt: Date | null;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentRidderInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        endedAt: Date | null;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRouteRidderInvitesByReceverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        endedAt: Date | null;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    updateRidderInviteById(id: string, inviterId: string, updateRidderInviteDto: UpdateRidderInviteDto): Promise<{
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        id: string;
        updatedAt: Date;
    }[]>;
    decideRidderInviteById(id: string, receiverId: string, decideRidderInviteDto: DecideRidderInviteDto): Promise<{
        orderId: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        price: number;
        passsengerStartCord: {
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
        passengerStartAddress: string;
        passengerEndAddress: string;
        ridderStartAddress: string;
        startAfter: Date;
        endedAt: Date;
        orderStatus: "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED";
    }[] | {
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        updatedAt: Date;
    }[] | undefined>;
    deleteRidderInviteById(id: string, inviterId: string): Promise<{
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        id: string;
    }[]>;
}
