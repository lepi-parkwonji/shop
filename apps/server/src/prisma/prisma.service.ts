import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';
// Prisma 7: datasourceUrl 옵션 제거됨 → driver adapter 방식 필수
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.$executeRaw`SET TIME ZONE 'Asia/Seoul'`;
  }
}
