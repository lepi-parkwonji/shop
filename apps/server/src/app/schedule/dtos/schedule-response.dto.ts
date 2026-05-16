import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleStatus } from '@generated/prisma';

export class ScheduleResponseDTO {
  @ApiProperty({ type: Number }) id!: number;
  @ApiProperty({ type: String }) fairName!: string;
  @ApiProperty({ type: Number }) year!: number;
  @ApiProperty({ type: String }) region!: string;
  @ApiProperty({ type: String }) type!: string;
  @ApiProperty({ enum: ScheduleStatus }) status!: ScheduleStatus;
  @ApiProperty({ type: String }) startTime!: string;
  @ApiProperty({ type: String }) endTime!: string;
  @ApiProperty({ type: Number }) entranceFee!: number;
  @ApiProperty({ type: String }) place!: string;
  @ApiProperty({ type: String }) details!: string;
  @ApiPropertyOptional({ type: String }) notice!: string | null;
  @ApiPropertyOptional({ type: String }) eventNotes!: string | null;
  @ApiPropertyOptional({ type: String }) thumbnail!: string | null;
  @ApiProperty({ type: Number }) visitorCount!: number;
  @ApiProperty({ type: Boolean }) isExposed!: boolean;
  @ApiProperty({ type: String }) createdAt!: string;
  @ApiProperty({ type: String }) updatedAt!: string;
}
