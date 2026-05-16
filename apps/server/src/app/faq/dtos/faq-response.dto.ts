import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDTO {
  @ApiProperty({ type: Number }) id!: number;
  @ApiProperty({ type: String }) question!: string;
  @ApiProperty({ type: String }) answer!: string;
  @ApiProperty({ type: Boolean }) isExposed!: boolean;
  @ApiProperty({ type: Boolean }) isPinned!: boolean;
  @ApiProperty({ type: String }) createdAt!: string;
  @ApiProperty({ type: String }) updatedAt!: string;
}
