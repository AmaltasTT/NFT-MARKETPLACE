import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

@Schema({
    timestamps: true,
})
export class user extends Document{
    @Prop()
    name: string;

    @Prop({unique: [true, "Email already exists"]})
    email: string;

    @Prop()
    password: string

    @Prop()
    walletaddress: string
}
export const UserSchema = SchemaFactory.createForClass(user)

