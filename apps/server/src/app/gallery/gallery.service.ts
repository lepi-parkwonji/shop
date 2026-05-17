import { Injectable, NotFoundException } from '@nestjs/common';
import { Gallery, Prisma } from '@generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { CreateGalleryDTO } from './dtos/create-gallery.dto';
import { UpdateGalleryDTO } from './dtos/update-gallery.dto';
import { GallerySearchOptionDTO } from './dtos/gallery-search-option.dto';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(dto: GallerySearchOptionDTO): Prisma.GalleryWhereInput {
    return {
      deletedAt: null,
      ...(dto.category && { category: dto.category }),
      ...(dto.eventName && { eventName: dto.eventName }),
      ...(dto.query && {
        OR: [
          { title: { contains: dto.query } },
          { content: { contains: dto.query } },
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

  async search(dto: GallerySearchOptionDTO): Promise<OffsetPaginationDTO<Gallery>> {
    return this.paginate(this.buildSearchWhere(dto), dto.pageNo, dto.pageSize);
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

  async togglePin(id: number) {
    const gallery = await this.findOne(id);
    return this.prisma.gallery.update({ where: { id }, data: { isPinned: !gallery.isPinned } });
  }

  async searchPublic(dto: GallerySearchOptionDTO): Promise<OffsetPaginationDTO<Gallery>> {
    return this.paginate({ ...this.buildSearchWhere(dto), isExposed: true }, dto.pageNo, dto.pageSize);
  }

  async findOnePublic(id: number) {
    const gallery = await this.prisma.gallery.findFirst({
      where: { id, deletedAt: null, isExposed: true },
    });
    if (!gallery) throw new NotFoundException('갤러리를 찾을 수 없습니다.');
    return gallery;
  }
}
