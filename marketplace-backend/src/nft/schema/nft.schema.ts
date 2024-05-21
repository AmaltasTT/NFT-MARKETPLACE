import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { user } from "../../auth/schemas/user.schema";
import * as mongoose from 'mongoose'
import { Document } from 'mongoose'

@Schema({
    timestamps: true,
})
export class Nft extends Document {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
    imageUrl: string;

    @Prop()
    metadataUrl: string;

    @Prop()
    nftOwner: string

    @Prop()
    nftId: string
}

export const NftSchema = SchemaFactory.createForClass(Nft)