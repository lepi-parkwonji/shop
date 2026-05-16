import { Injectable, NotFoundException } from '@nestjs/common';
import { Gallery, Prisma } from '@generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { OffsetSearchOptionDTO } from '../../libs/dtos/search-option.dto';
import { CreateGalleryDTO } from './dtos/create-gallery.dto';
import { UpdateGalleryDTO } from './dtos/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(query?: string): Prisma.GalleryWhereInput {
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
    where: Prisma.GalleryWhereInput,
    pageNo: number,
    pageSize: number,
  ): Promise<OffsetPaginationDTO<Gallery>> {
    const skip = (pageNo - 1) * pageSize;
    const [totalItems, items] = await Promise.all([
      this.prisma.gallery.count({ where }),
      this.prisma.gallery.findMany({
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

  async search(dto: OffsetSearchOptionDTO): Promise<OffsetPaginationDTO<Gallery>> {
    const { pageNo, pageSize, query } = dto;
    return this.paginate(this.buildSearchWhere(query), pageNo, pageSize);
  }

  async findOne(id: number) {
    const gallery = await this.prisma.gallery.findFirst({ where: { id, deletedAt: null } });
    if (!gallery) throw new NotFoundException('갤러리를 찾을 수 없습니다.');
    return gallery;
  }

  async create(dto: CreateGalleryDTO) {
    return this.prisma.gallery.create({ data: dto });
  }

  async update(id: number, dto: UpdateGalleryDTO) {
    await this.findOne(id);
    return this.prisma.gallery.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.gallery.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getEventNames(): Promise<string[]> {
    const rows = await this.prisma.gallery.findMany({
      where: { deletedAt: null, eventName: { not: null } },
      select: { eventName: true },
      distinct: ['eventName'],
      orderBy: { eventName: 'asc' },
    });
    return rows.map(r => r.eventName as string);
  }

  async toggleExpose(id: number) {
    const gallery = await this.findOne(id);
    return this.prisma.gallery.update({ where: { id }, data: { isExposed: !gallery.isExposed } });
  }
}
