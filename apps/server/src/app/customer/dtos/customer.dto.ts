import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CustomerDTO {
  @ApiProperty({ type: Number }) @Expose() id!: number;
  @ApiProperty({ type: String }) @Expose() nickname!: string;
  @ApiProperty({ type: String, required: false }) @Expose() email?: string;
  @ApiProperty({ type: String, required: false }) @Expose() profileImage?: string;
}
