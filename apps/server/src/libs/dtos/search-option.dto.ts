import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OffsetSearchOptionDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageNo: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  query?: string;
}
