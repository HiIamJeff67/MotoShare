import { CreateRidderAuthDto } from './dto/create-ridderAuth.dto';
import { UpdateRidderAuthDto } from './dto/update-ridderAuth.dto';
export declare class RidderAuthService {
    create(createRidderAuthDto: CreateRidderAuthDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRidderAuthDto: UpdateRidderAuthDto): string;
    remove(id: number): string;
}
