import { Injectable } from '@nestjs/common';
import { CreateRidderAuthDto } from './dto/create-ridderAuth.dto';
import { UpdateRidderAuthDto } from './dto/update-ridderAuth.dto';

@Injectable()
export class RidderAuthService {
  create(createRidderAuthDto: CreateRidderAuthDto) {
    return 'This action adds a new ridderAuth';
  }

  findAll() {
    return `This action returns all ridderAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ridderAuth`;
  }

  update(id: number, updateRidderAuthDto: UpdateRidderAuthDto) {
    return `This action updates a #${id} ridderAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} ridderAuth`;
  }
}
