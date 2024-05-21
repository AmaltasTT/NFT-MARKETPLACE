import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { collectionAbi } from './nft-collection.abi';
import { CollectionSchema } from './schema/nft-collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as moongoose from 'mongoose'
import { resolve } from 'path';


@Injectable()
export class NftCollectionService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly contractAddress: string;
    private readonly abi: any[];

    constructor(@InjectModel(CollectionSchema.name)
    private nftCollectionModel: moongoose.Model<CollectionSchema>,) {
        this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/2275c01a51534148952b843d1ef1f366');
        this.contractAddress = '0xC2D51A2b4f36e057f7B2a8c46F7b61A768999F75';
        this.abi = collectionAbi;
    }

    async listenToCollectionEvent(): Promise<void> {
        const contract = new ethers.Contract(this.contractAddress, this.abi, this.provider);
        contract.on('CollectionCreated', async (owner: string, name: string, MyToken: any) => {
            console.log(`Collection Created: owner ${owner} collection-name ${name}, collection-Address: ${MyToken}`);
            try {
                const data = await this.nftCollectionModel.create({ owner, name, collectionAddress: MyToken });
                console.log('Event data stored in the database', data);
                return ({ owner, name, MyToken })
            } catch (error) {
                console.error('Error storing event data:', error);
            }
            return ({ owner, name, MyToken })
        });
    }

    async getCollectionsByUserAddress(owner: string) {
        const data = await this.nftCollectionModel.find({ owner: owner });
        // console.log('Collection-data :', data);
        return data;
    }

    async findByUserAddressAndId(owner: string, collectionId: string){
        const data = await this.nftCollectionModel.findOne({ owner, _id: collectionId })
        return data;
      }
}

