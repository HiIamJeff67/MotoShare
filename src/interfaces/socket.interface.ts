import { UserRoleType } from "../types";
import { Socket } from "socket.io";

export interface SocketUserInterface {
    id: string
    userName: string
    email: string
    accessToken: string
    role: UserRoleType
}

export interface SocketMetaPayloadInterface extends SocketUserInterface {
    socket: Socket
}

