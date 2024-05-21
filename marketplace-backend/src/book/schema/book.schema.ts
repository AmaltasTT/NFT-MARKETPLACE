import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { user } from "../../auth/schemas/user.schema";
import * as mongoose from 'mongoose'

export enum Category {
    ADVENTURE = 'Adventure',
    CLASSICS = 'Classics',
    CRIME = 'Crime'
}

@Schema({
    timestamps: true,
})
export class Book {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    author: string;

    @Prop()
    category: Category

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "user"})
    User: user
}

export const BookSchema = SchemaFactory.createForClass(Book)