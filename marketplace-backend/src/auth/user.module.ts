import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory:(config: ConfigService) => {
        return {
          secret: jwtConstants.secret,
          signOptions: {
            expiresIn: 200000 //config.get<string |number>('JWT_EXPIRE')
          }
        }
      }
    }),
    MongooseModule.forFeature([{name: 'user', schema: UserSchema}
  ])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
