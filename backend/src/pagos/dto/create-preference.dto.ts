import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreatePreferenceDto {
  @IsUUID()
  sesionId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  patente: string;
}