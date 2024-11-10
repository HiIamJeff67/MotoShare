import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
export declare class RidderInviteService {
    create(createRidderInviteDto: CreateRidderInviteDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRidderInviteDto: UpdateRidderInviteDto): string;
    remove(id: number): string;
}
