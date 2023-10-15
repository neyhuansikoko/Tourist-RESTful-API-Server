import { IsNotEmpty } from 'class-validator';

export class TripUserDto {
  userId: string;
  roles: string;
}

export class TripCreateDto {
  @IsNotEmpty()
  clientId: string;
  tanggalMulaiPerjalanan: Date;
  tanggalBerakhirPerjalanan: Date;
  destinasiPerjalanan: string;
}

export class TripUpdateDto {
  tanggalMulaiPerjalanan: Date;
  tanggalBerakhirPerjalanan: Date;
  destinasiPerjalanan: string;
}
