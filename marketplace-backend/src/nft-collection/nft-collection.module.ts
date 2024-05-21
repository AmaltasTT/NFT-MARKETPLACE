import { Module } from '@nestjs/common';
import { NftCollectionService } from './nft-collection.service';
import { NftCollectionController } from './nft-collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema, NftCollectionSchema } from './schema/nft-collection.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'CollectionSchema', schema: NftCollectionSchema}])],
  providers: [NftCollectionService],
  controllers: [NftCollectionController]
})
export class NftCollectionModule {}
