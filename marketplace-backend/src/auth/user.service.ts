import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { user } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './schemas/user-pass.schema';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(user.name)
        private userModel: mongoose.Model<user>,
        private jwtService: JwtService
    ) { }

    async signUp(signUpDto): Promise<{ token: string }> {
        console.log('signUpDto --------:', signUpDto);

        const userEmail = await this.userModel.findOne({ email: signUpDto.email })
        console.log('userEmail------ :', userEmail);

        if (userEmail) throw new ConflictException("Email already exists");
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10)

        const newUser = new this.userModel({
            name: signUpDto.name,
            email: signUpDto.email,
            password: hashedPassword,
            walletaddress: signUpDto.walletaddress
        })
        console.log('newUser :', newUser);
        const user = await newUser.save();
        const token = await this.jwtService.signAsync({ id: user._id })

        return { token };
    }

    async login(loginDto): Promise<{ token: string }> {
        const hashedPassword = await bcrypt.hash(loginDto.password, 10)
        console.log('loginDto :', loginDto);
        const { email, password, walletaddress } = loginDto

        const user = await this.userModel.findOne({ email })
        if (!user) throw new UnauthorizedException("Invalid email or password")

        const isWalletAddressMatched = await this.userModel.findOne({ walletaddress })
        if (!isWalletAddressMatched) throw new UnauthorizedException("Different Wallet Address")

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched) throw new UnauthorizedException("Invalid email or password")

        return { token: await this.jwtService.sign({ id: user._id }) }
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(id)
        console.log(user);
        const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)

        if (!user || !isPasswordMatched) throw new UnauthorizedException("Incorrect password")
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await new this.userModel(user).save()

        return { message: "Password changed successfully" }
    }
}
