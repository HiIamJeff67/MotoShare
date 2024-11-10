import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { DecidePassengerInviteDto, UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerInviteService {
    private db;
    constructor(db: DrizzleDB);
    createPassengerInviteByOrderId(inviterId: string, orderId: string, createPassengerInviteDto: CreatePassengerInviteDto): Promise<{
        id: string;
        createdAt: Date;
        orderId: string | null;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    getPassengerInviteById(id: string): Promise<{
        id: string;
        createdAt: Date;
        startCord: {
            x: number;
            y: number;
        };
        endCord: {
            x: number;
            y: number;
        };
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        briefDescription: string | null;
        suggestPrice: number;
        suggestStartAfter: Date;
        order: {
            description: string | null;
            createdAt: Date;
            initPrice: number;
            startCord: {
                x: number;
                y: number;
            };
            endCord: {
                x: number;
                y: number;
            };
            startAfter: Date;
            updatedAt: Date;
            creator: {
                userName: string;
                info: {
                    isOnline: boolean;
                    phoneNumber: string | null;
                    avatorUrl: string | null;
                    motocycleLicense: string | null;
                    motocycleType: string | null;
                    motocyclePhotoUrl: string | null;
                } | null;
            } | null;
        } | null;
    } | undefined>;
    searchPaginationPassengerInvitesByInviterId(inviterId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        receiverName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByInviterId(inviterId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        receiverName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByInviterId(inviterId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        receiverName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByInviterId(inviterId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        receiverName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggetStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        RDV: unknown;
    }[]>;
    searchPaginationPasssengerInvitesByReceiverId(receiverId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        inviterName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
    searchCurAdjacentPassengerInvitesByReceiverId(receiverId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        inviterName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchDestAdjacentPassengerInvitesByReceiverId(receiverId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        inviterName: string | null;
        avatorUrl: string | null;
        initPrice: number | null;
        suggestPrice: number;
        startAfter: Date | null;
        suggestStartAfter: Date;
        createdAt: Date;
        updatedAt: Date;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
        distance: unknown;
    }[]>;
    searchSimilarRoutePassengerInvitesByReceverId(receiverId: string, limit: number, offset: number): Promise<{
        id: string;
        orderId: string | null;
        inviterName: string | null;
        avatorUrl: string | null;
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
    decidePassengerInvitebyId(id: string, receiverId: string, decidePassengerInviteDto: DecidePassengerInviteDto): Promise<import("pg").QueryResult<never>>;
    deletePassengerInviteById(id: string, inviterId: string): Promise<{
        id: string;
        status: "CANCEL" | "ACCEPTED" | "REJECTED" | "CHECKING";
    }[]>;
}
