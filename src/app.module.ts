import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceproviderModule } from './serviceprovider/serviceprovider/serviceprovider.module';

@Module({
  imports: [ServiceproviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
