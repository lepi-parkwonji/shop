import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFaqDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  answer?: string;
}
