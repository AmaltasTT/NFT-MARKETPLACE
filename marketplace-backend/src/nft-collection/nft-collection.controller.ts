import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CollectionSchema } from './schema/nft-collection.schema';
import { NftCollectionService } from './nft-collection.service';

@Controller('nft-collection')
export class NftCollectionController {

    constructor(private readonly nftCollectionService: NftCollectionService) { }

    @Post('listen')
    async listenToCollectionEvent():Promise<void>{
        return await this.nftCollectionService.listenToCollectionEvent();
    }

    @Get(':owner')
    async getCollectionsByUserAddress(@Param('owner') userAddress: string){
      return this.nftCollectionService.getCollectionsByUserAddress(userAddress);
    }

    @Get('/:owner/:collectionId')
  async findByUserAddressAndId(@Param('owner') owner: string, @Param('collectionId') collectionId: string) {
    return await this.nftCollectionService.findByUserAddressAndId(owner, collectionId);
  }
}
