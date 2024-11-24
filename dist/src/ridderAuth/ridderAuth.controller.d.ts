import { RidderAuthService } from './ridderAuth.service';
import { CreateRidderAuthDto } from './dto/create-ridderAuth.dto';
import { UpdateRidderAuthDto } from './dto/update-ridderAuth.dto';
export declare class RidderAuthController {
    private readonly ridderAuthService;
    constructor(ridderAuthService: RidderAuthService);
    create(createRidderAuthDto: CreateRidderAuthDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRidderAuthDto: UpdateRidderAuthDto): string;
    remove(id: string): string;
}
