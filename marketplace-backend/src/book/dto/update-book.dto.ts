import { IsEnum, IsOptional, IsString } from "class-validator"
import { Category } from "../schema/book.schema"

export class UpdateBookDto {
    @IsOptional()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly descripiton : string

    @IsOptional()
    @IsString()
    readonly author: string

    @IsOptional()
    @IsEnum(Category, {message: "Enter the correct type"})
    readonly category: Category
}