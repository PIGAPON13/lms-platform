import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Module({
  providers: [
    {
      provide: 'PRISMA_SERVICE',
      useValue: prisma,
    },
  ],
  exports: ['PRISMA_SERVICE'],
})
export class PrismaModule {}
