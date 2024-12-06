import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { DecideRidderInviteDto, UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { RidderNotificationService } from '../notification/ridderNotification.service';
export declare class RidderInviteService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    private updateExpiredRidderInvites;
    createRidderInviteByOrderId(inviterId: string, inviterName: string, orderId: string, createRidderInviteDto: CreateRidderInviteDto): Promise<{
        id: string;
        createdAt: Date;
        orderId: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
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
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchPaginationRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchAboutToStartRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRouteRidderInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
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
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchAboutToStartRidderInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
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
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        manhattanDistance: unknown;
    }[]>;
    searchDestAdjacentRidderInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        manhattanDistance: unknown;
    }[]>;
    searchSimilarRouteRidderInvitesByReceverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggestEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    updateRidderInviteById(id: string, inviterId: string, inviterName: string, updateRidderInviteDto: UpdateRidderInviteDto): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    decideRidderInviteById(id: string, receiverId: string, receiverName: string, decideRidderInviteDto: DecideRidderInviteDto): Promise<{
        orderId: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
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
    }[] | {
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[] | undefined>;
    deleteRidderInviteById(id: string, inviterId: string): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
}
