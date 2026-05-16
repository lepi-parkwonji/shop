import { ApiProperty } from '@nestjs/swagger';

export class PageInfoDTO {
  @ApiProperty({ type: Number }) pageNo!: number;
  @ApiProperty({ type: Number }) pageSize!: number;
  @ApiProperty({ type: Number }) totalItems!: number;
  @ApiProperty({ type: Number }) totalPages!: number;
}
