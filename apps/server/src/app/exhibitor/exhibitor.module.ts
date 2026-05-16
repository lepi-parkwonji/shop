import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ExhibitorController } from './exhibitor.controller';
import { ExhibitorService } from './exhibitor.service';

@Module({
  imports: [AuthModule],
  controllers: [ExhibitorController],
  providers: [ExhibitorService],
})
export class ExhibitorModule {}
