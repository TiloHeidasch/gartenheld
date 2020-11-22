import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  Delete,
  Put
} from '@nestjs/common';
import {
  CreateNewLagerDto,
  LagerDto,
  LagerPlatzDto,
  CreateNewLagerPlatzDto,
  LagerItemDto,
  CreateNewLagerItemDto
} from '@lager/api-interfaces';
import { LagerService } from './lager.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Lager, LagerPlatz, LagerItem } from './types';

@Controller('lager')
@ApiTags('Lager')
export class LagerController {
  constructor(private service: LagerService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all Lagers',
    description: 'Get all available lagers including their contents'
  })
  @ApiOkResponse({ description: 'The found Lagers', type: [LagerDto] })
  async getAllLagers(): Promise<LagerDto[]> {
    const lagers: Lager[] = await this.service.getAllLagers();
    const lagerDtos: LagerDto[] = [];
    lagers.forEach(lager => {
      lagerDtos.push(this.lagerToDto(lager));
    });
    return lagerDtos;
  }

  @Get(':lagerId')
  @ApiOperation({
    summary: 'Get Lager by ID',
    description: 'Get the specified lager including its contents'
  })
  @ApiOkResponse({ description: 'The found Lager', type: LagerDto })
  @ApiNotFoundResponse({ description: 'No lager found for specified id' })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  async getLagerById(@Param('lagerId') lagerId: string): Promise<LagerDto> {
    return this.lagerToDto(await this.service.getLagerById(lagerId));
  }

  @Post()
  @ApiOperation({
    summary: 'Create new Lager',
    description: 'Create a new Lager by name'
  })
  @ApiCreatedResponse({
    description: 'The newly created Lager',
    type: LagerDto
  })
  @ApiBody({
    description: 'The params to create the new lager',
    type: CreateNewLagerDto
  })
  async createNewLager(
    @Body() createLagerDto: CreateNewLagerDto
  ): Promise<LagerDto> {
    return this.lagerToDto(await this.service.addNewLager(createLagerDto.name));
  }
  @Put()
  @ApiOperation({
    summary: 'Update or create Lager',
    description: 'Update or Create a Lager'
  })
  @ApiCreatedResponse({
    description: 'The newly created Lager',
    type: LagerDto
  })
  @ApiOkResponse({
    description: 'The lager has been modified',
    type: LagerDto
  })
  @ApiBody({ description: 'The lager to be updated', type: LagerDto })
  async updateOrCreateLager(@Body() lagerDto: LagerDto): Promise<LagerDto> {
    const lager: Lager = this.dtoToLager(lagerDto);
    return this.lagerToDto(await this.service.updateOrCreateLager(lager));
  }
  @Delete(':lagerId')
  @ApiOperation({
    summary: 'Delete Lager by ID',
    description: 'Delete the specified lager including its contents'
  })
  @ApiNoContentResponse({ description: 'Lager deleted' })
  @ApiNotFoundResponse({ description: 'No lager found for specified id' })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  async deleteLagerById(@Param('lagerId') lagerId: string) {
    await this.service.deleteLagerById(lagerId);
  }

  @Get(':lagerId/lagerplatz')
  @ApiOperation({
    summary: 'Get all Lager Platzs',
    description:
      'Get all available lager platzs for the specified lager including their contents'
  })
  @ApiOkResponse({
    description: 'The found LagerPlatzs',
    type: [LagerPlatzDto]
  })
  @ApiNotFoundResponse({ description: 'No lager found for specified id' })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  async getAllLagerPlatzs(
    @Param('lagerId') lagerId: string
  ): Promise<LagerPlatzDto[]> {
    const platzs: LagerPlatz[] = await this.service.getAllLagerPlatzs(lagerId);
    const platzDtos: LagerPlatzDto[] = [];
    platzs.forEach(platz => {
      platzDtos.push(this.lagerPlatzToDto(platz));
    });
    return platzDtos;
  }
  @Get(':lagerId/lagerplatz/:lagerPlatzId')
  @ApiOperation({
    summary: 'Get LagerPlatz by ID',
    description: 'Get the specified lager platz including its contents'
  })
  @ApiOkResponse({ description: 'The found LagerPlatz', type: LagerPlatzDto })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz found for specified id'
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz',
    example: uuidv4()
  })
  async getLagerPlatzById(
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string
  ): Promise<LagerPlatzDto> {
    return this.lagerPlatzToDto(
      await this.service.getLagerPlatzById(lagerId, lagerPlatzId)
    );
  }
  @Post(':lagerId/lagerplatz')
  @ApiOperation({
    summary: 'Create new Lager Platz',
    description: 'Create a new Lager platz for lager by name'
  })
  @ApiCreatedResponse({
    description: 'The newly created LagerPlatz',
    type: LagerPlatzDto
  })
  @ApiNotFoundResponse({ description: 'No lager found for specified id' })
  @ApiBody({
    description: 'The params to create the new lagerPlatz',
    type: CreateNewLagerPlatzDto
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager in which to create the new platz',
    example: uuidv4()
  })
  async createNewLagerPlatz(
    @Body() createNewLagerPlatzDto: CreateNewLagerPlatzDto,
    @Param('lagerId') lagerId: string
  ): Promise<LagerPlatzDto> {
    return this.lagerPlatzToDto(
      await this.service.addNewLagerPlatz(lagerId, createNewLagerPlatzDto.name)
    );
  }
  @Put(':lagerId/lagerplatz')
  @ApiOperation({
    summary: 'Update or create Lager Platz',
    description: 'Update or Create a Lager Platz'
  })
  @ApiCreatedResponse({
    description: 'The newly created lagerPlatz',
    type: LagerPlatzDto
  })
  @ApiOkResponse({
    description: 'The lagerPlatz has been modified',
    type: LagerPlatzDto
  })
  @ApiBody({
    description: 'The lagerPlatz to be updated',
    type: LagerPlatzDto
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager in which to update or create the platz',
    example: uuidv4()
  })
  async updateOrCreateLagerPlatz(
    @Body() lagerPlatzDto: LagerPlatzDto,
    @Param('lagerId') lagerId: string
  ): Promise<LagerPlatzDto> {
    const lagerPlatz: LagerPlatz = this.dtoToLagerPlatz(lagerPlatzDto);
    return this.lagerPlatzToDto(
      await this.service.updateOrCreateLagerPlatz(lagerId, lagerPlatz)
    );
  }
  @Delete(':lagerId/lagerplatz/:lagerPlatzId')
  @ApiOperation({
    summary: 'Delete LagerPlatz by ID',
    description: 'Delete the specified lager platz including its contents'
  })
  @ApiNoContentResponse({ description: 'LagerPlatz deleted' })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz found for specified id'
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz',
    example: uuidv4()
  })
  async deleteLagerPlatzById(
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string
  ) {
    await this.service.deleteLagerPlatzById(lagerId, lagerPlatzId);
  }

  @Get(':lagerId/lagerplatz/:lagerPlatzId/lagerItem')
  @ApiOperation({
    summary: 'Get all Lager Items',
    description:
      'Get all available lager items for the specified lager/lager platz including their quantities'
  })
  @ApiOkResponse({
    description: 'The found LagerItems',
    type: [LagerItemDto]
  })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz found for specified id'
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz',
    example: uuidv4()
  })
  async getAllLagerItems(
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string
  ): Promise<LagerItemDto[]> {
    const items: LagerItem[] = await this.service.getAllLagerItems(
      lagerId,
      lagerPlatzId
    );
    const itemDtos: LagerItemDto[] = [];
    items.forEach(item => {
      itemDtos.push(this.lagerItemToDto(item));
    });
    return itemDtos;
  }
  @Get(':lagerId/lagerplatz/:lagerPlatzId/lagerItem/:lagerItemId')
  @ApiOperation({
    summary: 'Get LagerItem by ID',
    description: 'Get the specified lager item including its quantity'
  })
  @ApiOkResponse({ description: 'The found LagerItem', type: LagerItemDto })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz/lagerItem found for specified id'
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerItemId',
    description: 'The id of the lagerItem',
    example: uuidv4()
  })
  async getLagerItemById(
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string,
    @Param('lagerItemId') lagerItemId: string
  ): Promise<LagerItemDto> {
    return this.lagerItemToDto(
      await this.service.getLagerItemById(lagerId, lagerPlatzId, lagerItemId)
    );
  }
  @Post(':lagerId/lagerplatz/:lagerPlatzId/lagerItem')
  @ApiOperation({
    summary: 'Create new Lager Item',
    description:
      'Create a new Lager Item for lager and lager platz by name and quantity'
  })
  @ApiCreatedResponse({
    description: 'The newly created LagerItem',
    type: LagerItemDto
  })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz found for specified id'
  })
  @ApiBody({
    description: 'The params to create the new lagerItem',
    type: CreateNewLagerItemDto
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager in which to create the new item',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz in which to create the new item',
    example: uuidv4()
  })
  async createNewLagerItem(
    @Body() createNewLagerItemDto: CreateNewLagerItemDto,
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string
  ): Promise<LagerItemDto> {
    return this.lagerItemToDto(
      await this.service.addNewLagerItem(
        lagerId,
        lagerPlatzId,
        createNewLagerItemDto.name,
        createNewLagerItemDto.quantity,
        createNewLagerItemDto.unit
      )
    );
  }
  @Put(':lagerId/lagerplatz/:lagerPlatzId/lagerItem')
  @ApiOperation({
    summary: 'Update or create Lager Item',
    description: 'Update or Create a Lager Item'
  })
  @ApiCreatedResponse({
    description: 'The newly created lagerItem',
    type: LagerItem
  })
  @ApiOkResponse({
    description: 'The lagerItem has been modified',
    type: LagerItem
  })
  @ApiBody({ description: 'The lagerItem to be updated', type: LagerItemDto })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager in which to update or create the item',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description:
      'The id of the lagerPlatz in which to update or create the item',
    example: uuidv4()
  })
  async updateOrCreateLagerItem(
    @Body() lagerItemDto: LagerItemDto,
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string
  ): Promise<LagerItemDto> {
    const lagerItem: LagerItem = this.dtoToLagerItem(lagerItemDto);
    return this.lagerItemToDto(
      await this.service.updateOrCreateLagerItem(
        lagerId,
        lagerPlatzId,
        lagerItem
      )
    );
  }
  @Delete(':lagerId/lagerplatz/:lagerPlatzId/lagerItem/:lagerItemId')
  @ApiOperation({
    summary: 'Delete LagerItem by ID',
    description: 'Delete the specified lager item'
  })
  @ApiNoContentResponse({ description: 'LagerItem deleted' })
  @ApiNotFoundResponse({
    description: 'No lager/lagerPlatz/lagerItem found for specified id'
  })
  @ApiParam({
    name: 'lagerId',
    description: 'The id of the lager',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerPlatzId',
    description: 'The id of the lagerPlatz',
    example: uuidv4()
  })
  @ApiParam({
    name: 'lagerItemId',
    description: 'The id of the lagerItem',
    example: uuidv4()
  })
  async deleteLagerItemById(
    @Param('lagerId') lagerId: string,
    @Param('lagerPlatzId') lagerPlatzId: string,
    @Param('lagerItemId') lagerItemId: string
  ) {
    await this.service.deleteLagerItemById(lagerId, lagerPlatzId, lagerItemId);
  }

  private lagerToDto(lager: Lager): LagerDto {
    const platzs: LagerPlatzDto[] = [];
    lager.platzs.forEach(platz => {
      platzs.push(this.lagerPlatzToDto(platz));
    });
    return {
      id: lager.id,
      name: lager.name,
      platzs,
      created: lager.created
    };
  }
  private lagerPlatzToDto(lagerPlatz: LagerPlatz): LagerPlatzDto {
    const lagerItems: LagerItemDto[] = [];
    lagerPlatz.lagerItems.forEach(lagerItem => {
      lagerItems.push(this.lagerItemToDto(lagerItem));
    });
    return {
      id: lagerPlatz.id,
      name: lagerPlatz.name,
      lagerItems,
      created: lagerPlatz.created
    };
  }
  private lagerItemToDto(lagerItem: LagerItem): LagerItemDto {
    return {
      id: lagerItem.id,
      name: lagerItem.name,
      quantity: lagerItem.quantity,
      unit: lagerItem.unit,
      created: lagerItem.created
    };
  }

  private dtoToLager(lagerDto: LagerDto): Lager {
    const platzs: LagerPlatz[] = [];
    lagerDto.platzs.forEach(platz => {
      platzs.push(this.dtoToLagerPlatz(platz));
    });
    return {
      id: lagerDto.id,
      name: lagerDto.name,
      platzs,
      created: lagerDto.created
    };
  }
  private dtoToLagerPlatz(lagerPlatzDto: LagerPlatzDto): LagerPlatz {
    const lagerItems: LagerItem[] = [];
    lagerPlatzDto.lagerItems.forEach(lagerItem => {
      lagerItems.push(this.dtoToLagerItem(lagerItem));
    });
    return {
      id: lagerPlatzDto.id,
      name: lagerPlatzDto.name,
      lagerItems,
      created: lagerPlatzDto.created
    };
  }
  private dtoToLagerItem(lagerItemDto: LagerItemDto): LagerItem {
    return {
      id: lagerItemDto.id,
      name: lagerItemDto.name,
      quantity: lagerItemDto.quantity,
      unit: lagerItemDto.unit,
      created: lagerItemDto.created
    };
  }
}
