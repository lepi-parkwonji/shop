import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { CreateFaqDTO } from './dtos/create-faq.dto';
import { UpdateFaqDTO } from './dtos/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async search(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<object>> {
    const { pageNo, pageSize, query } = dto;
    const skip = (pageNo - 1) * pageSize;

    const where = {
      deletedAt: null,
      ...(query && {
        OR: [
          { question: { contains: query } },
          { answer: { contains: query } },
        ],
      }),
    };

    const [totalItems, items] = await Promise.all([
      this.prisma.faq.count({ where }),
      this.prisma.faq.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      items,
      pageInfo: { pageNo, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) },
    };
  }

  async findOne(id: number) {
    const faq = await this.prisma.faq.findFirst({ where: { id, deletedAt: null } });
    if (!faq) throw new NotFoundException('FAQ를 찾을 수 없습니다.');
    return faq;
  }

  async create(dto: CreateFaqDTO) {
    return this.prisma.faq.create({ data: { ...dto, authorId: 1 } });
  }

  async update(id: number, dto: UpdateFaqDTO) {
    await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async togglePin(id: number) {
    const faq = await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: { isPinned: !faq.isPinned } });
  }

  async toggleExpose(id: number) {
    const faq = await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: { isExposed: !faq.isExposed } });
  }

  async searchPublic(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<object>> {
    const { pageNo, pageSize, query } = dto;
    const skip = (pageNo - 1) * pageSize;

    const where = {
      deletedAt: null,
      isExposed: true,
      ...(query && {
        OR: [
          { question: { contains: query } },
          { answer: { contains: query } },
        ],
      }),
    };

    const [totalItems, items] = await Promise.all([
      this.prisma.faq.count({ where }),
      this.prisma.faq.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
    ]);

    return {
      items,
      pageInfo: { pageNo, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) },
    };
  }

  async findOnePublic(id: number) {
    const faq = await this.prisma.faq.findFirst({
      where: { id, deletedAt: null, isExposed: true },
    });
    if (!faq) throw new NotFoundException('FAQ를 찾을 수 없습니다.');
    return faq;
  }
}
