import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { NftSchema } from './schema/nft.schema';
import { NFTList, NftListSchema } from './schema/nft-list.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Nft', schema: NftSchema}, {name: "NFTList", schema: NftListSchema}])],
  controllers: [NftController],
  providers: [NftService]
})
export class NftModule { }
