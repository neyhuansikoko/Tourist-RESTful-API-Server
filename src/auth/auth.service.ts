import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './guard';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthLoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      });

      if (!user) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const passwordMatch = await argon2.verify(
        user.passwordHash,
        dto.password,
      );

      if (!passwordMatch) {
        throw new ForbiddenException('Credentials incorrect');
      }

      return this.signToken(user.id, user.username, user.roles);
    } catch (err) {
      throw err;
    }
  }

  async register(dto: AuthRegisterDto) {
    try {
      const hash = await argon2.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          passwordHash: hash,
          roles: dto.roles,
        },
      });

      if (user.roles == Role.Client) {
        await this.prisma.client.create({
          data: {
            userId: user.id,
          },
        });
      }

      return this.signToken(user.id, user.username, user.roles);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }

  async signToken(
    userId: string,
    username: string,
    roles: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
      roles,
    };

    const jwtKey = this.config.get('JWT_KEY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: jwtKey,
    });

    return { access_token: token };
  }
}
