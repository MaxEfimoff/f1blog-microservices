import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [CompanyModule, MongooseModule.forRoot(process.env.MONGO_URI)],
  controllers: [],
  providers: [],
})
export class AppModule {}
