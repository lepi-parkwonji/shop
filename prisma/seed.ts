import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234', 10);
  await prisma.admin.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      usrname: 'admin',
      password,
      displayName: '관리자',
    },
  });
  console.log('✓ Admin seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
