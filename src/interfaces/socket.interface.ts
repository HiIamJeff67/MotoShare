import { UserRoleType } from "../types"

export interface SocketUserInterface {
    id: string
    userName: string
    email: string
    accessToken: string
    role: UserRoleType
}

export interface SocketMetaPayloadInterface extends SocketUserInterface {
	socketId: string
}