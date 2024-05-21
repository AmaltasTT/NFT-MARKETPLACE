// src/nft/nft-collection.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class CollectionSchema {

    @Prop()
    owner: string

    @Prop({ required: true })
    name: string;

    @Prop()
    collectionAddress: string
}

export const NftCollectionSchema = SchemaFactory.createForClass(CollectionSchema);