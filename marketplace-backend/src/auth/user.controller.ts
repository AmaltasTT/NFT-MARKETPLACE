import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './schemas/user-pass.schema';
import { user } from './schemas/user.schema';

@Controller('auth')
export class UserController {
    constructor(private userService: UserService) { }


    @Post('/signup')
    signup(@Body() signUpDto: CreateUserDto) {
        // console.log('signUpDto ----------:', signUpDto);
        return this.userService.signUp(signUpDto)
    }

    @Post('/login')
    login(@Body() loginDto: LoginDto) {
    console.log('loginDto -------:', loginDto);
        return this.userService.login(loginDto);
    }

    @Post('/change-password')
    @UseGuards(AuthGuard())
    changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req)
     {
        const id = req.user._id
        console.log(id);

        return this.userService.changePassword(id, changePasswordDto)
        
    }
}
