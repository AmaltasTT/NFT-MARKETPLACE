import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { user } from "./schemas/user.schema";
import {Model} from 'mongoose';
import { jwtConstants } from './constant';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(user.name)
        private userModel: Model<user>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret
        })
    }

    async validate(payload) {
        const {id} = payload;

        const user = await this.userModel.findById(id);

        if(!user) throw new UnauthorizedException("You need to login first")

        return user;
    }
}
