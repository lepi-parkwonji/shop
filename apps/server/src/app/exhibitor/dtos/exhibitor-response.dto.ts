import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoothType, ExhibitorStatus } from '@generated/prisma';

export class ExhibitorResponseDTO {
  @ApiProperty({ type: Number }) id!: number;
  @ApiProperty({ type: Number }) scheduleId!: number;
  @ApiProperty({ type: String }) scheduleFairName!: string;
  @ApiProperty({ type: String }) companyName!: string;
  @ApiProperty({ type: String }) representativeName!: string;
  @ApiProperty({ type: String }) businessRegNumber!: string;
  @ApiProperty({ type: String }) managerName!: string;
  @ApiProperty({ type: String }) contact!: string;
  @ApiProperty({ type: String }) email!: string;
  @ApiProperty({ enum: BoothType }) boothType!: BoothType;
  @ApiProperty({ type: Number }) boothCount!: number;
  @ApiProperty({ type: [String] }) options!: string[];
  @ApiProperty({ type: Number }) totalFee!: number;
  @ApiProperty({ enum: ExhibitorStatus }) status!: ExhibitorStatus;
  @ApiPropertyOptional({ type: String }) boothNumber!: string | null;
  @ApiPropertyOptional({ type: String }) adminMemo!: string | null;
  @ApiProperty({ type: Boolean }) isExposed!: boolean;
  @ApiProperty({ type: String }) createdAt!: string;
  @ApiProperty({ type: String }) updatedAt!: string;
}
