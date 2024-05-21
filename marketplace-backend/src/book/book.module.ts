import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './schema/book.schema';
import { UserModule } from '../auth/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{name: 'Book', schema: BookSchema}])
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
