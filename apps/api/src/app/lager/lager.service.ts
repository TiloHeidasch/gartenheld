import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promisify } from 'util';
import { readFile, exists, writeFile } from 'fs';
import { Lager, LagerPlatz, LagerItem } from './types';

@Injectable()
export class LagerService {
  private readonly lagerFilePath = 'data/lager.json';
  private readonly logger = new Logger(LagerService.name);

  async getAllLagers(): Promise<Lager[]> {
    const lagerFile = await this.loadLagerFile();
    return this.sortLagers(lagerFile.lagers);
  }
  async getLagerById(lagerId: string): Promise<Lager> {
    const lagerFile = await this.loadLagerFile();
    const lager: Lager = lagerFile.lagers.find(lager => lager.id === lagerId);
    if (lager === undefined) {
      console.log(lagerFile);
      throw new NotFoundException('Lager with id ' + lagerId + ' not found');
    }
    return lager;
  }
  async addNewLager(name: string): Promise<Lager> {
    const lager: Lager = new Lager(name);
    const lagerFile = await this.loadLagerFile();
    lagerFile.lagers.push(lager);
    lagerFile.lagers = this.sortLagers(lagerFile.lagers);
    await promisify(writeFile)(
      this.lagerFilePath,
      JSON.stringify(lagerFile, undefined, 2)
    );
    return lager;
  }
  async updateLager(lager: Lager) {
    const lagerFile = await this.loadLagerFile();
    lagerFile.lagers = lagerFile.lagers.filter(
      lagerInFile => lagerInFile.id !== lager.id
    );
    lagerFile.lagers.push(lager);
    lagerFile.lagers = this.sortLagers(lagerFile.lagers);
    await promisify(writeFile)(
      this.lagerFilePath,
      JSON.stringify(lagerFile, undefined, 2)
    );
  }
  async deleteLagerById(lagerId: string) {
    //call to see if the lager actually exists
    await this.getLagerById(lagerId);
    const lagerFile = await this.loadLagerFile();
    lagerFile.lagers = lagerFile.lagers.filter(
      lagerInFile => lagerInFile.id !== lagerId
    );
    lagerFile.lagers = this.sortLagers(lagerFile.lagers);
    await promisify(writeFile)(
      this.lagerFilePath,
      JSON.stringify(lagerFile, undefined, 2)
    );
  }
  async updateOrCreateLager(newLager: Lager): Promise<Lager> {
    try {
      //check if it exists
      await this.getLagerById(newLager.id);
      await this.updateLager(newLager);
      return newLager;
    } catch (error) {
      //if it doesn't exist we have to create a new one
      const lager: Lager = await this.addNewLager(newLager.name);
      //and add the requested contents to it
      for (let index = 0; index < newLager.platzs.length; index++) {
        const newSlot = newLager.platzs[index];
        lager.platzs.push(
          await this.updateOrCreateLagerPlatz(lager.id, newSlot)
        );
      }
      await this.updateLager(lager);
      return await this.getLagerById(lager.id);
    }
  }
  async getAllLagerPlatzs(lagerId: string): Promise<LagerPlatz[]> {
    const lager: Lager = await this.getLagerById(lagerId);
    return this.sortLagerPlatzs(lager.platzs);
  }
  async getLagerPlatzById(
    lagerId: string,
    platzId: string
  ): Promise<LagerPlatz> {
    const lager: Lager = await this.getLagerById(lagerId);
    const platz: LagerPlatz = lager.platzs.find(platz => platz.id === platzId);
    if (platz === undefined) {
      throw new NotFoundException(
        'LagerPlatz with id ' + platzId + ' not found'
      );
    }
    return platz;
  }
  async addNewLagerPlatz(lagerId: string, name: string): Promise<LagerPlatz> {
    const lagerPlatz: LagerPlatz = new LagerPlatz(name);
    const lager: Lager = await this.getLagerById(lagerId);
    lager.platzs.push(lagerPlatz);
    await this.updateLager(lager);
    return lagerPlatz;
  }
  async updateLagerPlatz(lagerId: string, lagerPlatz: LagerPlatz) {
    const lager: Lager = await this.getLagerById(lagerId);
    lager.platzs = lager.platzs.filter(platz => platz.id !== lagerPlatz.id);
    lager.platzs.push(lagerPlatz);
    await this.updateLager(lager);
  }
  async deleteLagerPlatzById(lagerId: string, lagerPlatzId: string) {
    //call to see if platz actually exists
    await this.getLagerPlatzById(lagerId, lagerPlatzId);
    const lager: Lager = await this.getLagerById(lagerId);
    lager.platzs = lager.platzs.filter(platz => platz.id !== lagerPlatzId);
    await this.updateLager(lager);
  }
  async updateOrCreateLagerPlatz(
    lagerId: string,
    newLagerPlatz: LagerPlatz
  ): Promise<LagerPlatz> {
    try {
      //check if it exists
      await this.getLagerPlatzById(lagerId, newLagerPlatz.id);
      await this.updateLagerPlatz(lagerId, newLagerPlatz);
      return newLagerPlatz;
    } catch (error) {
      //if it doesn't exist we have to create a new one
      const lagerPlatz: LagerPlatz = await this.addNewLagerPlatz(
        lagerId,
        newLagerPlatz.name
      );
      //and add the requested contents to it
      for (let index = 0; index < newLagerPlatz.lagerItems.length; index++) {
        const newItem = newLagerPlatz.lagerItems[index];
        lagerPlatz.lagerItems.push(
          await this.updateOrCreateLagerItem(lagerId, lagerPlatz.id, newItem)
        );
      }
      await this.updateLagerPlatz(lagerId, lagerPlatz);
      return await this.getLagerPlatzById(lagerId, lagerPlatz.id);
    }
  }

  async getAllLagerItems(
    lagerId: string,
    lagerPlatzId: string
  ): Promise<LagerItem[]> {
    const lagerPlatz: LagerPlatz = await this.getLagerPlatzById(
      lagerId,
      lagerPlatzId
    );
    return this.sortLagerItems(lagerPlatz.lagerItems);
  }
  async getLagerItemById(
    lagerId: string,
    lagerPlatzId: string,
    lagerItemId: string
  ): Promise<LagerItem> {
    const lagerPlatz: LagerPlatz = await this.getLagerPlatzById(
      lagerId,
      lagerPlatzId
    );
    const item: LagerItem = lagerPlatz.lagerItems.find(
      item => item.id === lagerItemId
    );
    if (item === undefined) {
      throw new NotFoundException(
        'LagerItem with id ' + lagerItemId + ' not found'
      );
    }
    return item;
  }
  async addNewLagerItem(
    lagerId: string,
    lagerPlatzId: string,
    name: string,
    quantity?: number,
    unit?: string
  ): Promise<LagerItem> {
    const lagerItem: LagerItem = new LagerItem(name, quantity, unit);
    const lagerPlatz: LagerPlatz = await this.getLagerPlatzById(
      lagerId,
      lagerPlatzId
    );
    lagerPlatz.lagerItems.push(lagerItem);
    await this.updateLagerPlatz(lagerId, lagerPlatz);
    return lagerItem;
  }
  async updateLagerItem(
    lagerId: string,
    lagerPlatzId: string,
    lagerItem: LagerItem
  ) {
    const lagerPlatz: LagerPlatz = await this.getLagerPlatzById(
      lagerId,
      lagerPlatzId
    );
    lagerPlatz.lagerItems = lagerPlatz.lagerItems.filter(
      item => item.id !== lagerItem.id
    );
    lagerPlatz.lagerItems.push(lagerItem);
    await this.updateLagerPlatz(lagerId, lagerPlatz);
  }
  async deleteLagerItemById(
    lagerId: string,
    lagerPlatzId: string,
    lagerItemId: string
  ) {
    //call to see if item actually exists
    await this.getLagerItemById(lagerId, lagerPlatzId, lagerItemId);
    const lagerPlatz: LagerPlatz = await this.getLagerPlatzById(
      lagerId,
      lagerPlatzId
    );
    lagerPlatz.lagerItems = lagerPlatz.lagerItems.filter(
      item => item.id !== lagerItemId
    );
    await this.updateLagerPlatz(lagerId, lagerPlatz);
  }
  async updateOrCreateLagerItem(
    lagerId: string,
    lagerPlatzId: string,
    newLagerItem: LagerItem
  ): Promise<LagerItem> {
    try {
      //check if it exists
      await this.getLagerItemById(lagerId, lagerPlatzId, newLagerItem.id);
      await this.updateLagerItem(lagerId, lagerPlatzId, newLagerItem);
      return newLagerItem;
    } catch (error) {
      //if it doesn't exist we have to create a new one
      const lagerItem: LagerItem = await this.addNewLagerItem(
        lagerId,
        lagerPlatzId,
        newLagerItem.name,
        newLagerItem.quantity
      );
      return lagerItem;
    }
  }

  private async loadLagerFile(): Promise<{ lagers: Lager[] }> {
    try {
      if (await this.resultFileExists()) {
        const lagersBuffer = await promisify(readFile)(this.lagerFilePath);
        const lagers = lagersBuffer.toString();
        return lagers ? JSON.parse(lagers) : { lagers: [] };
      } else {
        return { lagers: [] };
      }
    } catch (error) {
      this.logger.error(error);
      return { lagers: [] };
    }
  }

  /**
   * Check if the result file exists.
   */
  async resultFileExists() {
    return await promisify(exists)(this.lagerFilePath);
  }
  private sortLagers(lagers: Lager[]): Lager[] {
    lagers = lagers.sort(
      (f1, f2) => f1.created.valueOf() - f2.created.valueOf()
    );
    lagers.forEach(lager => {
      lager.platzs = this.sortLagerPlatzs(lager.platzs);
    });
    return lagers;
  }
  private sortLagerPlatzs(platzs: LagerPlatz[]): LagerPlatz[] {
    platzs.sort((s1, s2) => s1.created.valueOf() - s2.created.valueOf());
    platzs.forEach(platz => {
      platz.lagerItems = this.sortLagerItems(platz.lagerItems);
    });
    return platzs;
  }
  private sortLagerItems(items: LagerItem[]): LagerItem[] {
    return items.sort((i1, i2) => i1.created.valueOf() - i2.created.valueOf());
  }
}
