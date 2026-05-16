import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength,
} from 'class-validator';
import { ScheduleStatus } from '@generated/prisma';

export class UpdateScheduleDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '박람회명은 2자 이상 입력해주세요.' })
  @MaxLength(100, { message: '박람회명은 100자 이내로 입력해주세요.' })
  fairName?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ enum: ScheduleStatus })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  entranceFee?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  place?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notice?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  eventNotes?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  visitorCount?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isExposed?: boolean;
}
