import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SigninDto } from './dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor (private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {

  }

  async signup(auth: SignupDto, service: string) {
    console.log('head ', {auth});
    const hash = await argon.hash(auth.password);
    const client = this.prisma[service];
    try {
      const account = await client.create({
        data: {...auth, password: hash}
      });

      delete account.password;
      return account;
    } catch (error) {
      // if(error instanceof PrismaClientKnownRequestError) {
      //   if(error.code == 'P2002') {
      //     throw new ForbiddenException('Credentials taken');
      //   }
      // }

      throw error;
    }
  }

  async signin(auth: SigninDto, service: string) {
    console.log({service});
    const client = this.prisma[service];
    console.log({client});

    const account = await client.findFirst({
      where: {
        OR: [
          {
            email: auth.login
          },{
            login: auth.login
          }
        ]
      },
    });

    if(!account || !await argon.verify(account.password, auth.password)) {
      throw new ForbiddenException('Credentials incorrect');
    }

    delete account.password;
    return account;
  }


  async signToken(userId: BigInt, service: string, email: string): Promise<string> {
    console.log(userId.toString());
    const payload = {
      sub: userId.toString(),
      service,
      email
    };

    const secret = this.config.get('jwt_secret');

    return await this.jwt.signAsync(payload, {
      expiresIn: '5h',
      secret
    });
  }
}
