import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OffsetSearchOptionDTO {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageNo = 1;

  @ApiPropertyOptional({ type: Number, default: 10, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize = 10;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  query?: string;
}
