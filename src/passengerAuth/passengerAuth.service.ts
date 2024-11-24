import { Injectable } from '@nestjs/common';
import { CreatePassengerAuthDto } from './dto/create-passengerAuth.dto';
import { UpdatePassengerAuthDto } from './dto/update-passengerAuth.dto';

@Injectable()
export class PassengerAuthService {
  create(createPassengerAuthDto: CreatePassengerAuthDto) {
    return 'This action adds a new passengerAuth';
  }

  findAll() {
    return `This action returns all passengerAuth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passengerAuth`;
  }

  update(id: number, updatePassengerAuthDto: UpdatePassengerAuthDto) {
    return `This action updates a #${id} passengerAuth`;
  }

  remove(id: number) {
    return `This action removes a #${id} passengerAuth`;
  }
}
