import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { NotificationService } from './passenerNotification.service';
import { Server, Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { SocketMetaPayloadInterface } from '../interfaces/socket.interface';
import { HttpStatusCode } from '../enums';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private notificationService;
    private configService;
    private db;
    constructor(notificationService: NotificationService, configService: ConfigService, db: DrizzleDB);
    server: Server;
    socketMap: Map<string, SocketMetaPayloadInterface>;
    private validateToken;
    private getUserById;
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
}
