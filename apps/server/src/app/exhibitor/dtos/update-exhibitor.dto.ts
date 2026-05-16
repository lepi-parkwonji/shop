import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BoothType, ExhibitorStatus } from '@generated/prisma';

export class UpdateExhibitorDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(100)
  companyName?: string;

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

  @ApiPropertyOptional({ enum: BoothType })
  @IsOptional() @IsEnum(BoothType)
  boothType?: BoothType;

  @ApiPropertyOptional({ type: Number })
  @IsOptional() @IsInt() @Min(1)
  boothCount?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional() @IsInt() @Min(0)
  totalFee?: number;

  @ApiPropertyOptional({ enum: ExhibitorStatus })
  @IsOptional() @IsEnum(ExhibitorStatus)
  status?: ExhibitorStatus;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(50)
  boothNumber?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional() @IsString() @MaxLength(500)
  adminMemo?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isExposed?: boolean;
}
