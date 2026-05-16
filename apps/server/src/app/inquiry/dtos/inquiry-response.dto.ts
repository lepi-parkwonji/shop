import { ApiProperty } from '@nestjs/swagger';

export class InquiryResponseDTO {
  @ApiProperty({ type: Number }) id!: number;
  @ApiProperty({ type: String }) title!: string;
  @ApiProperty({ type: String }) content!: string;
  @ApiProperty({ type: String }) authorName!: string;
  @ApiProperty({ type: String, nullable: true }) answer!: string | null;
  @ApiProperty({ type: Boolean }) isAnswered!: boolean;
  @ApiProperty({ type: Boolean }) isExposed!: boolean;
  @ApiProperty({ type: Boolean }) isSecret!: boolean;
  @ApiProperty({ type: Number, nullable: true }) customerId!: number | null;
  @ApiProperty({ type: String }) createdAt!: string;
  @ApiProperty({ type: String }) updatedAt!: string;
}
