import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsIP,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Message {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string = '';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string = '';
}

export class CreateDataDto {
  @ApiProperty()
  @IsNotEmpty()
  ts: string = ''; // Initialize with empty string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sender: string = ''; // Initialize with empty string

  @ApiProperty({ type: () => Message })
  @IsDefined()
  @ValidateNested()
  @Type(() => Message)
  message: Message = new Message(); // Initialize with Message instance

  @ApiProperty()
  @IsOptional()
  @IsIP()
  sent_from_ip: string = ''; // Initialize with empty string

  @ApiProperty()
  @IsOptional()
  priority: number = 0; // Initialize with 0

  constructor(data: Partial<CreateDataDto>) {
    Object.assign(this, data);
  }
}
