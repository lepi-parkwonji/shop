import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength,
} from 'class-validator';

export class CreateScheduleDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '박람회명을 입력해주세요.' })
  @IsString()
  @MinLength(2, { message: '박람회명은 2자 이상 입력해주세요.' })
  @MaxLength(100, { message: '박람회명은 100자 이내로 입력해주세요.' })
  fairName!: string;

  @ApiProperty({ type: Number })
  @IsInt()
  year!: number;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '지역을 입력해주세요.' })
  @IsString()
  @MaxLength(50, { message: '지역명은 50자 이내로 입력해주세요.' })
  region!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ type: String, description: 'ISO 8601 datetime' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ type: String, description: 'ISO 8601 datetime' })
  @IsDateString()
  endTime!: string;

  @ApiProperty({ type: Number, default: 0 })
  @IsInt()
  @Min(0)
  entranceFee!: number;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '장소를 입력해주세요.' })
  @IsString()
  @MaxLength(200, { message: '장소는 200자 이내로 입력해주세요.' })
  place!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: '상세 내용을 입력해주세요.' })
  @IsString()
  details!: string;

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
}
