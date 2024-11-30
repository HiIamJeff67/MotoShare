import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect, 
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as jwt from 'jsonwebtoken'
import { Server, Socket } from "socket.io";
import { Inject, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { JwtPayload } from 'jsonwebtoken';
import { PassengerTable } from '../drizzle/schema/passenger.schema';
import { eq } from 'drizzle-orm';
import { ApiMissingUserRoleInHeaderWhileConnectingToSocketException, ClientInvalidTokenException, ClientPassengerNotFoundException, ClientRidderNotFoundException, ClientTokenExpiredException, ServerExtractJwtSecretEnvVariableException, ServerTranslateBearerTokenToPayloadException, ServerUserNotFoundInSocketMapException } from '../exceptions';
import { UserRoleType } from '../types';
import { SocketUserInterface, SocketMetaPayloadInterface } from '../interfaces/socket.interface';
import { RidderTable } from '../drizzle/schema/ridder.schema';
import { response, Response } from 'express';
import { HttpStatusCode } from '../enums';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private notificationService: NotificationService, 
    private configService: ConfigService, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  @WebSocketServer()
  server: Server
  
  socketMap = new Map<string, SocketMetaPayloadInterface>();

  /* ================================= Validation operations ================================= */
  private validateToken(token: string): JwtPayload {
	  const secret = this.configService.get<string>("JWT_SECRET");
	  if (!secret) throw ServerExtractJwtSecretEnvVariableException;

    try {
      const response = jwt.verify(token, secret) as JwtPayload;

	  	return response;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private async getUserById(
		userId: string, 
		token: string, 
		userRole: UserRoleType
	): Promise<SocketUserInterface> {
    let user: any = undefined;

		if (userRole === "Passenger") {
			user = await this.db.select({
				id: PassengerTable.id, 
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
				accessToken: PassengerTable.accessToken, 
			}).from(PassengerTable)
				.where(eq(PassengerTable.id, userId))
				.limit(1);
		} else if (userRole === "Ridder") {
			user = await this.db.select({
				id: RidderTable.id, 
				userName: RidderTable.userName, 
				email: RidderTable.email, 
				accessToken: RidderTable.accessToken, 
			}).from(RidderTable)
				.where(eq(RidderTable.id, userId))
				.limit(1);
		}
    if (!user || user.length === 0) {
      throw ClientInvalidTokenException;
    }

    const userData = user[0];
    if (token !== userData.accessToken) {
      throw ClientTokenExpiredException;
    }
    delete userData.accessToken;

    return {
			...userData, 
			role: userRole, 
		};
  }
  /* ================================= Validation operations ================================= */


	/* ================================= Connection & Disconnection operations ================================= */
	async handleConnection(socket: Socket) {
		try {
			const token = socket.handshake.headers.authorization?.split(' ')[1];
			if (!token) throw ClientTokenExpiredException;

			const userRole = socket.handshake.headers.userrole as UserRoleType;
			if (!userRole) throw ApiMissingUserRoleInHeaderWhileConnectingToSocketException;

			const payload = this.validateToken(token);
			if (!payload || !payload.sub) throw ServerTranslateBearerTokenToPayloadException;

			const user = await this.getUserById(payload.sub, token, userRole);
			if (!user) throw (userRole === "Passenger" 
				? ClientPassengerNotFoundException 
				: ClientRidderNotFoundException
			);

			console.log({ ...user, socketId: socket.id });
			this.socketMap.set(user.id, {
				...user, 
				socketId: socket.id, 
			});
			console.log(`User ${user.id} connected with socket ID ${socket.id}`);
			return {
				status: HttpStatusCode.SwitchingProtocols,
				upgrade: socket.handshake.headers.upgrade, 
				message: `User ${user.userName} connected with socket ID ${socket.id}`, 
			};
		} catch (error) {
			console.log(`Connection failed: ${error}`);
			socket.disconnect(true);
			return {
				statu: error.status, 
				message: error, 
			};
		}
  }

  handleDisconnect(socket: Socket) {
		try {
			const [userId, userData] = Array.from(this.socketMap.entries()).find(
				([, metaPayloads]) => metaPayloads.socketId === socket.id,
			) || [undefined, undefined];
			if (!userId || !userData) throw ServerUserNotFoundInSocketMapException;
	
			this.socketMap.delete(userId);
			console.log(`User ${userId} disconnected with socket ID ${socket.id}`);
			return {
				status: HttpStatusCode.Ok, 
				message: `Good bye! User ${userData.userName} disconnected with socket ID ${socket.id}`, 
			};
		} catch (error) {
			console.log(`Disconnection failed: ${error}`);
			return {
				status: error.status, 
				message: error
			};
		}
  }
	/* ================================= Connection & Disconnection operations ================================= */


	/* ================================= Details Database operations ================================= */
	
	/* ================================= Details Database operations ================================= */
}
