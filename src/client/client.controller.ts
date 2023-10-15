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
import { JwtGuard, Role } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { ClientService } from './client.service';
import { ClientUpdateDto, ClientUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  getAllClient(@GetUser() user: ClientUserDto) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.clientService.getAllClients();
  }

  @Get(':id')
  getClient(@GetUser() user: ClientUserDto, @Param() params: any) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.clientService.getClient(params.id);
  }

  @Patch(':id')
  updateClient(
    @GetUser() user: ClientUserDto,
    @Param() params: any,
    @Body() dto: ClientUpdateDto,
  ) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.clientService.updateClient(params.id, dto);
  }

  @Delete(':id')
  deleteClient(@GetUser() user: ClientUserDto, @Param() params: any) {
    if (user.roles != Role.Employee) {
      throw new ForbiddenException('Unauthorized access');
    }
    return this.clientService.deleteClient(params.id);
  }
}
