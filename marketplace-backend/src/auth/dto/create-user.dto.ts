import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
     name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Please enter correct email"})
     email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
     password: string

    @IsNotEmpty()
    readonly walletaddress: string;
}