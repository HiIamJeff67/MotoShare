import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { RidderNotificationService } from '../notification/ridderNotification.service';
import { PassengerNotificationService } from '../notification/passenerNotification.service';
import { SearchPriorityType } from '../types';
export declare class PassengerInviteService {
    private passengerNotification;
    private ridderNotification;
    private db;
    constructor(passengerNotification: PassengerNotificationService, ridderNotification: RidderNotificationService, db: DrizzleDB);
    private updateExpiredPassengerInvites;
    createPassengerInviteByOrderId(inviterId: string, inviterName: string, orderId: string, createPassengerInviteDto: CreatePassengerInviteDto): Promise<{
        id: string;
        orderId: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        hasConflict: boolean;
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
        motocycleLicense: string | null;
        motocycleType: string | null;
        motocyclePhotoUrl: string | null;
        phoneNumber: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    searchPaginationPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchAboutToStartPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchSimilarTimePassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        manhattanDistance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        manhattanDistance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        receiverName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        RDV: unknown;
    }[]>;
    searchBetterFirstPassengerInvitesByInviterId(inviterId: string, receiverName: string | undefined, limit: number, offset: number, searchPriorities: SearchPriorityType): Promise<({
        [x: string]: any;
    } | {
        [x: string]: any;
    })[]>;
    searchPaginationPasssengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchAboutToStartPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchSimilarTimePassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByReceverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number): Promise<{
        id: string;
        orderId: string;
        suggestStartAddress: string;
        suggestEndAddress: string;
        inviterName: never;
        avatorUrl: never;
        suggestPrice: number;
        suggestStartAfter: Date;
        suggesEndedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    searchBetterFirstPassengerInvitesByReceiverId(receiverId: string, inviterName: string | undefined, limit: number, offset: number, searchPriorities: SearchPriorityType): Promise<{
        supplyOrder: any;
        passengerInvite: any;
    }[]>;
    updatePassengerInviteById(id: string, inviterId: string, inviterName: string, updatePassengerInviteDto: UpdatePassengerInviteDto): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        hasConflict: any;
    }[]>;
    decidePassengerInviteById(id: string, receiverId: string, receiverName: string, decidePassengerInviteDto: DecidePassengerInviteDto): Promise<{
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
        orderStatus: "UNSTARTED" | "STARTED" | "UNPAID" | "FINISHED";
    }[] | {
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[] | undefined>;
    deletePassengerInviteById(id: string, inviterId: string): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
}
