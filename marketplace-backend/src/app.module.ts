import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './book/book.module';
import { NftModule } from './nft/nft.module';
import { MulterModule } from '@nestjs/platform-express';
import { NftCollectionModule } from './nft-collection/nft-collection.module';


@Module({
  imports: [
    MulterModule.register({
      dest: 'https://api.pinata.cloud/pinning/pinFileToIPFS' // Destination folder for uploaded files
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot("mongodb://localhost:27017/library-nest-api"),
    MongooseModule.forRoot("mongodb+srv://vercel-admin-user:ATorIgQ8VH7uDIFJ@cluster0.0pc9b4d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"),
    UserModule,
    BookModule,
    NftModule,
    NftCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
