import { Injectable, NotFoundException } from '@nestjs/common';
import { Inquiry, Prisma } from '@generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { AnswerInquiryDTO } from './dtos/answer-inquiry.dto';
import { CreateInquiryDTO } from './dtos/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(query?: string): Prisma.InquiryWhereInput {
    return {
      deletedAt: null,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { authorName: { contains: query } },
        ],
      }),
    };
  }

  private async paginate(
    where: Prisma.InquiryWhereInput,
    pageNo: number,
    pageSize: number,
  ): Promise<OffsetPaginationDTO<Inquiry>> {
    const skip = (pageNo - 1) * pageSize;
    const [totalItems, items] = await Promise.all([
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      items,
      pageInfo: { pageNo, pageSize, totalItems, totalPages: Math.ceil(totalItems / pageSize) },
    };
  }

  async search(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<Inquiry>> {
    const { pageNo, pageSize, query } = dto;
    return this.paginate(this.buildSearchWhere(query), pageNo, pageSize);
  }

  async findOne(id: number) {
    const inquiry = await this.prisma.inquiry.findFirst({ where: { id, deletedAt: null } });
    if (!inquiry) throw new NotFoundException('문의를 찾을 수 없습니다.');
    return inquiry;
  }

  async create(dto: CreateInquiryDTO) {
    return this.prisma.inquiry.create({ data: dto });
  }

  async answer(id: number, dto: AnswerInquiryDTO) {
    await this.findOne(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: { answer: dto.answer, isAnswered: true },
    });
  }

  async toggleExpose(id: number) {
    const inquiry = await this.findOne(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: { isExposed: !inquiry.isExposed },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.inquiry.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
