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

  const inquiryCount = await prisma.inquiry.count();
  if (inquiryCount === 0) {
    await prisma.inquiry.createMany({
      data: [
        { title: '배송 관련 문의드립니다', content: '주문한 상품이 아직 도착하지 않았습니다. 배송 현황을 확인해 주실 수 있을까요?', authorName: '김철수' },
        { title: '교환 및 환불 문의', content: '구매한 상품의 사이즈가 맞지 않아 교환을 원합니다. 교환 절차가 어떻게 되나요?', authorName: '이영희', isAnswered: true, answer: '교환 신청은 마이페이지 > 주문내역에서 가능합니다. 수령 후 7일 이내 신청해 주세요.' },
        { title: '회원 정보 수정이 안 됩니다', content: '연락처를 변경하려고 하는데 저장이 되지 않습니다. 도움 부탁드립니다.', authorName: '박민준' },
        { title: '이벤트 참여 방법 문의', content: '현재 진행 중인 이벤트에 참여하고 싶은데 방법을 알려주세요.', authorName: '최수진', isExposed: true },
        { title: '결제 오류 발생', content: '카드 결제 시 오류가 발생하여 결제가 되지 않습니다. 확인 부탁드립니다.', authorName: '정대현', isAnswered: true, answer: '결제 오류는 카드사 서버 점검 시간에 발생할 수 있습니다. 잠시 후 다시 시도해 주세요.' },
      ],
    });
    console.log('✓ Inquiry seeded (5건)');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
