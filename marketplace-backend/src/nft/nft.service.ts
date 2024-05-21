import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { MarketAbi } from './nftMarket.abi';
import { ethers } from 'ethers'
import axios from 'axios';
const pinataSDK = require('@pinata/sdk');
import * as FormData from 'form-data';
import { generateNftMetadata } from './nft.utils';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/mongoose';
import { Nft } from './schema/nft.schema';
import * as moongoose from 'mongoose'
import { NFTList, NFTListDocument } from './schema/nft-list.schema';
import { NftABI } from './nft.abi';
import { contractAddress } from 'env';



@Injectable()
export class NftService {
    private provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/2275c01a51534148952b843d1ef1f366');
    private abi = MarketAbi
    private nftABI = NftABI
    nftContractAddres = contractAddress.nftContractAddress //"0x7bf1eEA2c602300b44Ff8Dac69F06639F5DBa135"
    private nftContract = new ethers.Contract(this.nftContractAddres, this.nftABI, this.provider)
    private marketContractAddress = contractAddress.nftMarketContractAddress //"0x2D8D144b5A158d620DD180bEb230f92E9bB32e25"
    private contract = new ethers.Contract(this.marketContractAddress, this.abi, this.provider);
    imageUrl: any
    metadataUrl: any

    constructor(@InjectModel(Nft.name)
    private nftModel: moongoose.Model<Nft>,
        @InjectModel(NFTList.name) private nftListModel: moongoose.Model<NFTList>) { }

    async uploadToPinata(file: Express.Multer.File, name: string, description: string): Promise<any> {

        const pinataApiKey = '470191ed2ab4ab1686df';
        const pinataSecretApiKey = 'b09041c7376a3d91909cc6db0fab7db9f9b4be5724fa92f6e44ca02a80ae1927';
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        // Upload image to IPFS
        const imageFormData = new FormData();
        imageFormData.append('file', Readable.from(file.buffer), {
            filename: String(file.originalname),
        });

        const imageResponse = await axios.post(url, imageFormData, {
            maxContentLength: Infinity,
            headers: {
                ...imageFormData.getHeaders(),
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
        });
        this.imageUrl = `https://azure-past-guan-217.mypinata.cloud/ipfs/${imageResponse.data.IpfsHash}`;

        // Generate and upload metadata to IPFS
        const metadata = generateNftMetadata(name, description, this.imageUrl); // Generate metadata
        const metadataFormData = new FormData();
        metadataFormData.append('file', Buffer.from(JSON.stringify(metadata)), {
            filename: 'metadata.json',
        });

        const metadataResponse = await axios.post(url, metadataFormData, {
            maxContentLength: Infinity,
            headers: {
                ...metadataFormData.getHeaders(),
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
        });

        this.metadataUrl = `https://azure-past-guan-217.mypinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
        const imageUrl = this.imageUrl
        const metadataUrl = this.metadataUrl
        await this.nftEvent();
        return { imageUrl, metadataUrl }
    }

    async nftEvent(): Promise<any> {
        await this.nftContract.on('NFTMinted', async (nft: string, nftOwner: string, nftId: string) => {
            const imageUrl = this.imageUrl
            const metadataUrl = this.metadataUrl

            const nftData = new this.nftModel({
                _id: new moongoose.Types.ObjectId(),
                imageUrl,
                metadataUrl,
                nftOwner,
                nftId
            })

            return await nftData.save();;
        })
    }

    async findAllNfts(): Promise<Nft[]> {
        return this.nftModel.find()
    }

    async updateNftOwner(nftId: any, nftOwner: string): Promise<Nft> {
        const query = { nftId: nftId }
        const updatedNft = await this.nftModel.findOneAndUpdate(
            query,
            { nftOwner },
            { new: true },
        );
        if (!updatedNft) {
            throw new NotFoundException('NFT not found');
        }
        return updatedNft;
    }


    async getNftByUserAddress(nftOwner: string): Promise<any> {
        const nfts = await this.nftModel.find({ nftOwner }).exec();
        return nfts.map(nft => nft);
    }

    async listEvent() {
        await this.contract.on('ListNFT', async (nftAddress: string, nftId: string, owner: string, nftPrice: string, expiryTime: string, status: string, listingType: string) => {
            try {
                const existingData = await this.nftListModel.findOne({ nftId });
                if (existingData) {
                    // If existing data found, delete it from the database
                    await this.nftListModel.deleteOne({ nftId });
                }
                const nft = await this.nftModel.findOne({ nftId })
                const imageUrl = await nft.imageUrl
                const price = await ethers.formatEther(nftPrice)
                const data = await new this.nftListModel({ nftAddress, nftId, imageUrl, owner, price, expiryTime, status, listingType })
                if (data.status == "NFT Listed") {
                    await data.save()
                } else {
                    alert("")
                }
                return ({ nftAddress, nftId, owner, })
            } catch (error) {
                console.error(error.message);
            }
        })
    }

    async auctionEvent() {
        await this.contract.on('AuctionNFT', async (nftAddress: string, nftId: string, seller: string, winner: string, intialPrice: string, lastBidPrice: string, currentBidPrice: string, expiryTime: string, compeleted: boolean) => {})
    }

    async findListedNft(nftAddress: string) {
        return await this.nftListModel.find({ nftAddress});
    }

    async findNftById(_id: string) {
        return await this.nftModel.find({ _id })
    }

    findAndDelete(nftId: string) {
        const deleteListedItem = this.nftListModel.deleteOne({ nftId })
        return deleteListedItem
    }
}
