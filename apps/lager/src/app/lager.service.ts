import { Injectable } from '@angular/core';
import {
  LagerDto,
  CreateNewLagerDto,
  LagerPlatzDto,
  CreateNewLagerPlatzDto,
  LagerItemDto,
  CreateNewLagerItemDto
} from '@lager/api-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LagerService {
  constructor(private http: HttpClient) {}
  async getAllLagers(): Promise<LagerDto[]> {
    const lagers: LagerDto[] = await this.http
      .get<LagerDto[]>('/api/lager')
      .toPromise();
    return lagers;
  }
  async createLager(name: string): Promise<LagerDto> {
    const createLagerDto: CreateNewLagerDto = { name };
    const lager: LagerDto = await this.http
      .post<LagerDto>('/api/lager/', createLagerDto)
      .toPromise();
    return lager;
  }
  async createLagerPlatz(
    lager: LagerDto,
    name: string
  ): Promise<LagerPlatzDto> {
    const createLagerPlatzDto: CreateNewLagerPlatzDto = { name };
    const lagerPlatz: LagerPlatzDto = await this.http
      .post<LagerPlatzDto>(
        '/api/lager/' + lager.id + '/lagerplatz/',
        createLagerPlatzDto
      )
      .toPromise();
    return lagerPlatz;
  }
  async createLagerItem(
    lager: LagerDto,
    lagerPlatz: LagerPlatzDto,
    name: string,
    quantity: number,
    unit: string
  ): Promise<LagerItemDto> {
    const createNewLagerItemDto: CreateNewLagerItemDto = {
      name,
      quantity,
      unit
    };
    const lagerItem: LagerItemDto = await this.http
      .post<LagerItemDto>(
        '/api/lager/' +
          lager.id +
          '/lagerplatz/' +
          lagerPlatz.id +
          '/lagerItem/',
        createNewLagerItemDto
      )
      .toPromise();
    return lagerItem;
  }
  async updateLager(lager: LagerDto): Promise<LagerDto> {
    const updatedLager: LagerDto = await this.http
      .put<LagerDto>('/api/lager/', lager)
      .toPromise();
    return updatedLager;
  }
  async updateLagerPlatz(
    lager: LagerDto,
    lagerPlatz: LagerPlatzDto
  ): Promise<LagerPlatzDto> {
    const updatedLagerPlatz: LagerPlatzDto = await this.http
      .put<LagerPlatzDto>('/api/lager/' + lager.id + '/lagerplatz/', lagerPlatz)
      .toPromise();
    return updatedLagerPlatz;
  }
  async updateLagerItem(
    lager: LagerDto,
    lagerPlatz: LagerPlatzDto,
    lagerItem: LagerItemDto
  ): Promise<LagerItemDto> {
    const updatedLagerItem: LagerItemDto = await this.http
      .put<LagerItemDto>(
        '/api/lager/' +
          lager.id +
          '/lagerplatz/' +
          lagerPlatz.id +
          '/lagerItem/',
        lagerItem
      )
      .toPromise();
    return updatedLagerItem;
  }
  async deleteLagerItem(
    lager: LagerDto,
    lagerPlatz: LagerPlatzDto,
    lagerItem: LagerItemDto
  ) {
    await this.http
      .delete(
        '/api/lager/' +
          lager.id +
          '/lagerplatz/' +
          lagerPlatz.id +
          '/lagerItem/' +
          lagerItem.id
      )
      .toPromise();
  }
  async deleteLagerPlatz(lager: LagerDto, lagerPlatz: LagerPlatzDto) {
    await this.http
      .delete('/api/lager/' + lager.id + '/lagerplatz/' + lagerPlatz.id)
      .toPromise();
  }
  async deleteLager(lager: LagerDto) {
    await this.http.delete('/api/lager/' + lager.id).toPromise();
  }
}
