import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { JwtGuard, Role } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { TripUpdateDto, TripUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get()
  getAllTrip(@GetUser() user: TripUserDto) {
    switch (user.roles) {
      case Role.Employee:
        return this.tripService.getAllTrip();

      case Role.Client:
        return this.tripService.findClientAndGetAllTrip(user.userId);

      default:
        throw new ForbiddenException('Unauthorized access');
    }
  }

  @Get(':clientId')
  getAllTripForClient(@GetUser() user: TripUserDto, @Param() params: any) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.tripService.getAllTripForClient(params.clientId);
  }

  @Get('/detail/:id')
  getTrip(@GetUser() user: TripUserDto, @Param() params: any) {
    switch (user.roles) {
      case Role.Employee:
        return this.tripService.getTrip(params.id, null);

      case Role.Client:
        return this.tripService.getTrip(params.id, user.userId);

      default:
        throw new ForbiddenException('Unauthorized access');
    }
  }

  @Patch(':id')
  updateTrip(
    @GetUser() user: TripUserDto,
    @Param() params: any,
    @Body() dto: TripUpdateDto,
  ) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.tripService.updateTrip(params.id, dto);
  }

  @Delete(':id')
  deleteTrip(@GetUser() user: TripUserDto, @Param() params: any) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.tripService.deleteTrip(params.id);
  }
}
