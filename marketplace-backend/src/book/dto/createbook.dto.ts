import { IsEmpty, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Category } from "../schema/book.schema"
import { user } from "../../auth/schemas/user.schema"

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string

    @IsNotEmpty()
    @IsString()
    readonly description : string

    @IsNotEmpty()
    @IsString()
    readonly author: string

    @IsNotEmpty()
    @IsEnum(Category, {message: "Enter the correct type"})
    readonly category: Category

    @IsEmpty({message: "You cannot pass user Id"})
    readonly User: user
}