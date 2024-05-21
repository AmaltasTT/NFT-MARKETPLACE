import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { user } from "../../auth/schemas/user.schema";
import * as mongoose from 'mongoose'
import { Nft } from "./nft.schema";

export type NFTListDocument = NFTList & Document;
@Schema({
    timestamps: true,
})

export class NFTList {
    // id: Nft;
  
    @Prop()
    nftAddress: string;
  
    @Prop()
    nftId: string;

    @Prop()
    imageUrl: string;
  
    @Prop()
    owner: string;
  
    @Prop()
    price: string;
  
    @Prop()
    expiryTime: string;
  
    
    @Prop()
    status: string;
  
    @Prop()
    listingType: string;
  }

export const NftListSchema = SchemaFactory.createForClass(NFTList)