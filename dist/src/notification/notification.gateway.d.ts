import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { HttpStatusCode } from '../enums';
import { NotificationInterface } from '../interfaces';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    private db;
    constructor(configService: ConfigService, db: DrizzleDB);
    private server;
    private socketMap;
    private _validateToken;
    private _getUserById;
    handleConnection(socket: Socket): Promise<{
        status: HttpStatusCode;
        upgrade: string | undefined;
        message: string;
        statu?: undefined;
    } | {
        statu: any;
        message: any;
        status?: undefined;
        upgrade?: undefined;
    }>;
    handleDisconnect(socket: Socket): {
        status: any;
        message: any;
    };
    forceDisconnect(socket: Socket): void;
    notifyPassenger(userId: string, notification: NotificationInterface): void;
    notifyRidder(userId: string, notification: NotificationInterface): void;
}
