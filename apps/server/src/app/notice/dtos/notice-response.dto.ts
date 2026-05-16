import { ApiProperty } from '@nestjs/swagger';

export class NoticeResponseDTO {
  @ApiProperty({ type: Number }) id!: number;
  @ApiProperty({ type: String }) title!: string;
  @ApiProperty({ type: String }) content!: string;
  @ApiProperty({ type: Boolean }) isExposed!: boolean;
  @ApiProperty({ type: Boolean }) isPinned!: boolean;
  @ApiProperty({ type: String, nullable: true }) imageURL!: string | null;
  @ApiProperty({ type: String, nullable: true }) fileUrl!: string | null;
  @ApiProperty({ type: String }) createdAt!: string;
  @ApiProperty({ type: String }) updatedAt!: string;
}
