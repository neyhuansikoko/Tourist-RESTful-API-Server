import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientUpdateDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getAllClients() {
    try {
      const clients = await this.prisma.client.findMany();
      return clients;
    } catch (err) {
      throw err;
    }
  }

  async getClient(id: string) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: id,
        },
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: client.userId,
        },
      });
      return { ...user, clientData: client };
    } catch (err) {
      throw err;
    }
  }

  async updateClient(id: string, dto: ClientUpdateDto) {
    try {
      if (dto.password != undefined) {
        const hash = await argon2.hash(dto.password);
        dto.password = hash;
      }

      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: dto,
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async deleteClient(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return { user: user, msg: 'Deleted' };
    } catch (err) {
      throw err;
    }
  }
}
