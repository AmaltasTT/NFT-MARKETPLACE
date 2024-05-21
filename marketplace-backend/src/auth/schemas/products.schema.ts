import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

@Schema({
    timestamps: true,
})
export class products{
    @Prop()
    product_name: string;

    @Prop({unique: [true, "Email already exists"]})
    price: number;

    @Prop()
    description: string

    @Prop()
    imageUrl: string

    @Prop()
    owners: string []
}
export const ProductSchema = SchemaFactory.createForClass(products)