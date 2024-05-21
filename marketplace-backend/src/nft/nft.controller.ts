import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NftService } from './nft.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as moongoose from 'mongoose'
import { Nft } from './schema/nft.schema';
import { NFTList } from './schema/nft-list.schema';

@Controller('nft')
export class NftController {

    constructor(private readonly nftService: NftService) { }

    @Get(':nftOwner')
    async fetchNft(@Param('nftOwner') nftOwner: string): Promise<{ success: boolean; imageUrl: string | string[] }> {
        console.log('nftOwner :', nftOwner);
        if (!nftOwner) {
            throw new BadRequestException('Invalid NFT owner address');
        }
        const imageUrl = await this.nftService.getNftByUserAddress(nftOwner);
        return { success: true, imageUrl };
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('name') name: string, @Body('description') description: string, @Body('nftOwner') nftOwner: any, nftId: string) {
        console.log('nftOwner :', nftOwner);
        console.log('description :', description);
        console.log('name :', name);
        // console.log('file :', file);
        if (!file) {
            return { message: 'No file uploaded', error: 'Bad Request', statusCode: 400 };
        }
        try {
            console.log("-----------------------------")
            const { imageUrl, metadataUrl } = await this.nftService.uploadToPinata(file, name, description);
            console.log('metadataUrl :', metadataUrl);
            console.log('imageUrl :', imageUrl);
            return {_id: new moongoose.Types.ObjectId(), imageUrl, metadataUrl, nftOwner };
        } catch (error) {
            return { message: error.message, error: 'Internal Server Error', statusCode: 500 };
        }
    }

    @Get()
    findAll():Promise<Nft[]> {
        return this.nftService.findAllNfts()
    }

    @Put(':nftId/owner')
    async updateNftOwner(@Param('nftId') nftId: any, @Body('nftOwner') nftOwner: string) {
        return this.nftService.updateNftOwner(nftId, nftOwner);
    }

    @Post('list-nft')
    async listEvent() {
        console.log("list Event");
        return await this.nftService.listEvent();
    }

    @Post('auction')
    async auctionEvent() {
        return await this.nftService.auctionEvent()
    }

    @Post('update-address')
    async updateAddress(@Body('nftContractAddres') nftContractAddres:string) {
        this.nftService.nftContractAddres = nftContractAddres
        console.log('this.nftService.nftContractAddres :', this.nftService.nftContractAddres);
        return this.nftService.nftContractAddres;
    }

    @Get('list/:address')
    findListedNft(@Param('address') address:string){
        console.log("123123213");
        return this.nftService.findListedNft(address)
    }

    @Get('detail/:_id')
    findNftById(@Param('_id') _id:string) {
        return this.nftService.findNftById(_id)
    }

    @Delete('delete/:nftId')
    deleteListedItem(@Param('nftId') nftId:string) {
        return this.nftService.findAndDelete(nftId);
    }


}
