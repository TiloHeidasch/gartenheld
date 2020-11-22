import { Module } from '@nestjs/common';
import { LagerController } from './lager/lager.controller';
import { LagerService } from './lager/lager.service';

@Module({
  imports: [],
  controllers: [LagerController],
  providers: [LagerService]
})
export class AppModule {}
