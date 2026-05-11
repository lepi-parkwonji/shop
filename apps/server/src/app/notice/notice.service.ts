import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { CreateNoticeDTO } from './dtos/create-notice.dto';
import { UpdateNoticeDTO } from './dtos/update-notice.dto';
import { SearchNoticeDTO } from './dtos/search-notice.dto';

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  async search(dto: SearchNoticeDTO): Promise<OffsetPaginationDTO<object>> {
    const { pageNo, pageSize, query } = dto;
    const skip = (pageNo - 1) * pageSize;

    const where = {
      deletedAt: null,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      }),
    };

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
      pageInfo: {
        pageNo,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findOne(id: number) {
    const notice = await this.prisma.notice.findFirst({ where: { id, deletedAt: null } });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return notice;
  }

  async create(dto: CreateNoticeDTO) {
    return this.prisma.notice.create({ data: { ...dto, authorId: 1 } });
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

  async searchPublic(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<object>> {
    const { pageNo, pageSize, query } = dto;
    const skip = (pageNo - 1) * pageSize;

    const where = {
      deletedAt: null,
      isExposed: true,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      }),
    };

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

  async findOnePublic(id: number) {
    const notice = await this.prisma.notice.findFirst({
      where: { id, deletedAt: null, isExposed: true },
    });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return notice;
  }
}
