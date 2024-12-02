import { 
	WebSocketGateway, 
	SubscribeMessage, 
	MessageBody, 
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WsResponse, 
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken'
import { Server, Socket } from "socket.io";
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { JwtPayload } from 'jsonwebtoken';
import { PassengerTable, RidderTable } from '../drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { ApiMissingUserRoleInHeaderWhileConnectingToSocketException, ClientInvalidTokenException, ClientPassengerNotFoundException, ClientRidderNotFoundException, ClientTokenExpiredException, ServerExtractJwtSecretEnvVariableException, ServerTranslateBearerTokenToPayloadException, ServerUserNotFoundInSocketMapException } from '../exceptions';
import { UserRoleType } from '../types';
import { SocketUserInterface, SocketMetaPayloadInterface } from '../interfaces/socket.interface';
import { HttpStatusCode } from '../enums';
import { NotificationInterface } from '../interfaces';

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private configService: ConfigService, 
		@Inject(DRIZZLE) private db: DrizzleDB, 
	) {}

	@WebSocketServer()
	private server: Server
	private socketMap = new Map<string, SocketMetaPayloadInterface>();

	/* ================================= Validation operations ================================= */
  	private validateToken(token: string): JwtPayload {
		const secret = this.configService.get<string>("JWT_SECRET");
		if (!secret) throw ServerExtractJwtSecretEnvVariableException;

		try {
			const response = jwt.verify(token, secret) as JwtPayload;

			return response;
		} catch (error) {
			throw ClientTokenExpiredException;
		}
  	}

	private async getUserById(
		userId: string, 
		token: string, 
		userRole: UserRoleType, 
	): Promise<SocketUserInterface> {
		const user = (userRole === "Passenger") 
			? await this.db.select({
				id: PassengerTable.id, 
				userName: PassengerTable.userName, 
				email: PassengerTable.email, 
				accessToken: PassengerTable.accessToken, 
			}).from(PassengerTable)
				.where(eq(PassengerTable.id, userId))
				.limit(1)
			: await this.db.select({
				id: RidderTable.id, 
				userName: RidderTable.userName, 
				email: RidderTable.email, 
				accessToken: RidderTable.accessToken, 
			}).from(RidderTable)
				.where(eq(RidderTable.id, userId))
				.limit(1);
		if (!user || user.length === 0) {
			throw ClientInvalidTokenException;
		}

		if (user[0].accessToken !== token) {
			throw ClientTokenExpiredException;
		}

		return {
			...user[0], 
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

			console.log({ ...user, socketId: socket.id });	// only while developing
			this.socketMap.set(user.id, {
				...user, 
				socketId: socket.id, 
			});

			socket.join(`${socket.id}'s notification`);	// let the users join their notification room to listen notifications

			console.log(`User ${user.id} connected with socket ID ${socket.id}`);	// only while developing
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
			console.log(`User ${userId} disconnected with socket ID ${socket.id}`);	// only while developing
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
	notifyPassenger(userId: string, notification: NotificationInterface) {
		console.log(`Pushing notification to user ${userId}: ${notification}`);
    	this.server.emit(`user_${userId}_notifications`, notification);
		const socket = this.socketMap.get(userId);
		if (socket && socket.role === "Passenger") {
			console.log(`Pushing to room : ${socket.socketId}'s notification`)
			this.server.to(`${socket.socketId}'s notification`).emit(`notification`, notification);
		}
	}

	notifyRidder(userId: string, notification: NotificationInterface) {
		console.log(`Pushing notification to user ${userId}: ${notification}`);
    	this.server.emit(`user_${userId}_notifications`, notification);
		const socket = this.socketMap.get(userId);
		if (socket && socket.role === "Ridder") {
			console.log(`Pushing to room : ${socket.socketId}'s notification`)
			this.server.to(`${socket.socketId}'s notification`).emit(`notification`, notification);
		}
	}
	/* ================================= Details Database operations ================================= */


	/* ================================= Test operations ================================= */
	@SubscribeMessage('test')
	onTest(@MessageBody() data: any): WsResponse<any> {
		const event = 'test';
		this.server.emit('test', { event, data });
		return { event, data };
	}
	/* ================================= Test operations ================================= */
}
