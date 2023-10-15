import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TripCreateDto, TripUpdateDto } from './dto';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  async getAllTrip() {
    try {
      const trips = await this.prisma.trip.findMany();
      return trips;
    } catch (err) {
      throw err;
    }
  }

  async getAllTripForClient(clientId: string) {
    try {
      const trips = await this.prisma.trip.findMany({
        where: {
          clientId: clientId,
        },
      });
      return trips;
    } catch (err) {
      throw err;
    }
  }

  async findClientAndGetAllTrip(userId: string) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          userId: userId,
        },
      });
      const trips = await this.prisma.trip.findMany({
        where: {
          clientId: client.id,
        },
      });
      return trips;
    } catch (err) {
      throw err;
    }
  }

  async getTrip(id: string, userId: string) {
    try {
      if (userId != null) {
        const client = await this.prisma.client.findUnique({
          where: {
            userId: userId,
          },
        });

        const trip = await this.prisma.trip.findUnique({
          where: {
            id: id,
            clientId: client.id,
          },
        });

        return trip;
      } else {
        const trip = await this.prisma.trip.findUnique({
          where: {
            id: id,
          },
        });

        return trip;
      }
    } catch (err) {
      throw err;
    }
  }

  async createTrip(dto: TripCreateDto) {
    try {
      const trip = await this.prisma.trip.create({
        data: {
          clientId: dto.clientId,
          tanggalMulaiPerjalanan: dto.tanggalMulaiPerjalanan,
          tanggalBerakhirPerjalanan: dto.tanggalBerakhirPerjalanan,
          destinasiPerjalanan: dto.destinasiPerjalanan,
        },
      });
      return trip;
    } catch (err) {
      throw err;
    }
  }

  async updateTrip(id: string, dto: TripUpdateDto) {
    try {
      const user = await this.prisma.trip.update({
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

  async deleteTrip(id: string) {
    try {
      const trip = await this.prisma.trip.delete({
        where: {
          id: id,
        },
      });
      return { trip: trip, msg: 'Deleted' };
    } catch (err) {
      throw err;
    }
  }
}
