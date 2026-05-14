import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Notice } from '@generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dto';

const SYSTEM_AUTHOR_ID = 1;

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(query?: string): Prisma.NoticeWhereInput {
    return {
      deletedAt: null,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      }),
    };
  }

  private async paginate(
    where: Prisma.NoticeWhereInput,
    pageNo: number,
    pageSize: number,
  ): Promise<OffsetPaginationDTO<Notice>> {
    const skip = (pageNo - 1) * pageSize;
    const [totalItems, items] = await Promise.all([
      this.prisma.notice.count({ where }),
      this.prisma.notice.findMany({
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

  async search(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<Notice>> {
    const { pageNo, pageSize, query } = dto;
    return this.paginate(this.buildSearchWhere(query), pageNo, pageSize);
  }

  async searchPublic(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<Notice>> {
    const { pageNo, pageSize, query } = dto;
    return this.paginate({ ...this.buildSearchWhere(query), isExposed: true }, pageNo, pageSize);
  }

  async findOne(id: number) {
    const notice = await this.prisma.notice.findFirst({ where: { id, deletedAt: null } });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return notice;
  }

  async findOnePublic(id: number) {
    const notice = await this.prisma.notice.findFirst({
      where: { id, deletedAt: null, isExposed: true },
    });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return notice;
  }

  async create(dto: CreateNoticeDTO) {
    return this.prisma.notice.create({ data: { ...dto, authorId: SYSTEM_AUTHOR_ID } });
  }

  async update(id: number, dto: UpdateNoticeDTO) {
    await this.findOne(id);
    return this.prisma.notice.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.notice.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async togglePin(id: number) {
    const notice = await this.findOne(id);
    return this.prisma.notice.update({ where: { id }, data: { isPinned: !notice.isPinned } });
  }

  async toggleExpose(id: number) {
    const notice = await this.findOne(id);
    return this.prisma.notice.update({ where: { id }, data: { isExposed: !notice.isExposed } });
  }
}
