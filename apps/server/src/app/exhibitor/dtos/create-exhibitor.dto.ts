import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BoothType } from '@generated/prisma';

export class CreateExhibitorDTO {
  @ApiProperty({ type: Number })
  @IsInt() @Min(1)
  scheduleId!: number;

  @ApiProperty({ type: String })
  @IsNotEmpty() @IsString() @MaxLength(100)
  companyName!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(50)
  representativeName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(20)
  businessRegNumber?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(50)
  managerName?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(20)
  contact?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsEmail()
  email?: string;

  @ApiProperty({ enum: BoothType })
  @IsEnum(BoothType)
  boothType!: BoothType;

  @ApiProperty({ type: Number })
  @IsInt() @Min(1)
  boothCount!: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional() @IsInt() @Min(0)
  totalFee?: number;
}
