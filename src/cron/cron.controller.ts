import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CronService } from './cron.service';
import { Response } from 'express';

@Controller('api/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get()
  test(@Res() response: Response) {
    response.status(200).send({context: "Hello Vercel Cron"})
  }
}
