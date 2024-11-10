import { RidderInviteService } from './ridderInvite.service';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';
export declare class RidderInviteController {
    private readonly ridderInviteService;
    constructor(ridderInviteService: RidderInviteService);
    create(createRidderInviteDto: CreateRidderInviteDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRidderInviteDto: UpdateRidderInviteDto): string;
    remove(id: string): string;
}
