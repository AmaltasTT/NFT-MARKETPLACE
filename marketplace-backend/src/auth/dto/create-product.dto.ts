import { IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";
import { user } from "../schemas/user.schema";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
     product_name: string;

    @IsNotEmpty()
     price: number;

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    imageUrl: string

    @IsEmpty({message: "You cannot pass user Id"})
    owners: string [];
}