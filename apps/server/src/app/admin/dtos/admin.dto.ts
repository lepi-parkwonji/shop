import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AdminDTO {
  @ApiProperty({ type: Number }) @Expose() id!: number;
  @ApiProperty({ type: String }) @Expose() usrname!: string;
  @ApiProperty({ type: String }) @Expose() displayName!: string;
}
