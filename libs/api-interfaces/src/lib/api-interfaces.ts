import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class LagerItemDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({
    description: 'The date the entry was created',
    example: new Date()
  })
  readonly created: Date;
  @ApiProperty({ description: 'The name of the lager item', example: 'Curry' })
  name: string;
  @ApiProperty({
    description: 'The quantity of how many are in store',
    example: 3
  })
  quantity: number;
  @ApiProperty({ description: 'The unit of the quantity', example: 'kg' })
  unit: string;
}
export class LagerPlatzDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({
    description: 'The date the entry was created',
    example: new Date()
  })
  readonly created: Date;
  @ApiProperty({
    description: 'The name of the lager platz',
    example: 'Bottom drawer'
  })
  name: string;
  @ApiProperty({
    description: 'The items stored in this lager platz',
    type: [LagerItemDto]
  })
  lagerItems: LagerItemDto[];
}
export class LagerDto {
  @ApiProperty({ description: 'The unique id', example: uuidv4() })
  readonly id: string;
  @ApiProperty({
    description: 'The date the entry was created',
    example: new Date()
  })
  readonly created: Date;
  @ApiProperty({ description: 'The name', example: 'The downstairs lager' })
  name: string;
  @ApiProperty({
    description: 'The lager platzs attributed to this lager',
    type: [LagerPlatzDto]
  })
  platzs: LagerPlatzDto[];
}
export class CreateNewLagerDto {
  @ApiProperty({
    description: 'The name of the new lager',
    example: 'Upstairs'
  })
  name: string;
}
export class CreateNewLagerPlatzDto {
  @ApiProperty({
    description: 'The name of the new Lager platz',
    example: 'Bottom drawer'
  })
  name: string;
}
export class CreateNewLagerItemDto {
  @ApiProperty({
    description: 'The name of the new lager item',
    example: 'My new lager item'
  })
  name: string;
  @ApiProperty({
    description: 'The amount of the newly created lager items',
    example: 12,
    required: false
  })
  quantity?: number;
  @ApiProperty({
    description: 'The unit of the quantity',
    example: 'kg',
    required: false
  })
  unit?: string;
}
