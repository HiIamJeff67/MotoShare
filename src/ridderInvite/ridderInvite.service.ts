import { Injectable } from '@nestjs/common';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';

@Injectable()
export class RidderInviteService {
  create(createRidderInviteDto: CreateRidderInviteDto) {
    return 'This action adds a new ridderInvite';
  }

  findAll() {
    return `This action returns all ridderInvite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ridderInvite`;
  }

  update(id: number, updateRidderInviteDto: UpdateRidderInviteDto) {
    return `This action updates a #${id} ridderInvite`;
  }

  remove(id: number) {
    return `This action removes a #${id} ridderInvite`;
  }
}
