import { Component } from '@angular/core';
import { LagerDto, LagerPlatzDto, LagerItemDto } from '@lager/api-interfaces';
import { LagerService } from './lager.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateLagerDialogComponent } from './create-lager-dialog/create-lager-dialog.component';
import { CreateLagerPlatzDialogComponent } from './create-lager-platz-dialog/create-lager-platz-dialog.component';
import { CreateLagerItemDialogComponent } from './create-lager-item-dialog/create-lager-item-dialog.component';
import { EditNameDialogComponent } from './edit-name-dialog/edit-name-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'lager-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  lagers: LagerDto[];
  activeLager: LagerDto = undefined;
  dataSources = [];
  displayedColumns: string[] = ['name', 'quantity', 'edit'];
  constructor(private lagerService: LagerService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.lagers = await this.lagerService.getAllLagers();
    this.setActiveLager(this.lagers[0]);
  }
  setActiveLager(lager: LagerDto) {
    this.activeLager = lager;
    this.updateDataSources();
  }
  private updateDataSources() {
    this.dataSources = [];
    this.activeLager.platzs.forEach(platz => {
      const dataSource = new MatTableDataSource(platz.lagerItems);
      this.dataSources.push(dataSource);
    });
  }
  createNewLager() {
    const dialogRef = this.dialog.open(CreateLagerDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newLager: LagerDto = await this.lagerService.createLager(name);
        this.lagers.push(newLager);
        this.setActiveLager(newLager);
      }
    });
  }
  createNewLagerPlatz() {
    const dialogRef = this.dialog.open(CreateLagerPlatzDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newLagerPlatz: LagerPlatzDto = await this.lagerService.createLagerPlatz(
          this.activeLager,
          name
        );
        this.activeLager.platzs.push(newLagerPlatz);
        this.updateDataSources();
      }
    });
  }
  createNewLagerItem() {
    const dialogRef = this.dialog.open(CreateLagerItemDialogComponent, {
      data: this.activeLager.platzs
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (
        result !== undefined &&
        result.name !== '' &&
        result.platz !== undefined &&
        result.quantity >= 0
      ) {
        const newLagerItem: LagerItemDto = await this.lagerService.createLagerItem(
          this.activeLager,
          result.platz,
          result.name,
          result.quantity,
          result.unit
        );
        result.platz.lagerItems.push(newLagerItem);
        this.updateDataSources();
      }
    });
  }
  editLagerItemName(lagerPlatzDto: LagerPlatzDto, lagerItemDto: LagerItemDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      data: lagerItemDto
    });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        lagerItemDto.name = name;
        lagerItemDto = await this.lagerService.updateLagerItem(
          this.activeLager,
          lagerPlatzDto,
          lagerItemDto
        );
        this.updateDataSources();
      }
    });
  }
  editLagerPlatzName(lagerPlatzDto: LagerPlatzDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      data: lagerPlatzDto
    });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        lagerPlatzDto.name = name;
        lagerPlatzDto = await this.lagerService.updateLagerPlatz(
          this.activeLager,
          lagerPlatzDto
        );
        this.updateDataSources();
      }
    });
  }
  editLagerName() {
    const dialogRef = this.dialog.open(EditNameDialogComponent, {
      data: this.activeLager
    });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        this.activeLager.name = name;
        this.setActiveLager(
          await this.lagerService.updateLager(this.activeLager)
        );
      }
    });
  }
  reduceQuantity(lagerPlatzDto: LagerPlatzDto, lagerItemDto: LagerItemDto) {
    if (lagerItemDto.quantity > 1) {
      lagerItemDto.quantity = lagerItemDto.quantity - 1;
      this.lagerService.updateLagerItem(
        this.activeLager,
        lagerPlatzDto,
        lagerItemDto
      );
    } else {
      this.deleteItem(lagerPlatzDto, lagerItemDto);
    }
    this.updateDataSources();
  }
  increaseQuantity(lagerPlatzDto: LagerPlatzDto, lagerItemDto: LagerItemDto) {
    lagerItemDto.quantity = lagerItemDto.quantity + 1;
    this.lagerService.updateLagerItem(
      this.activeLager,
      lagerPlatzDto,
      lagerItemDto
    );
    this.updateDataSources();
  }
  deleteItem(lagerPlatzDto: LagerPlatzDto, lagerItemDto: LagerItemDto) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: lagerItemDto
    });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        lagerPlatzDto.lagerItems = lagerPlatzDto.lagerItems.filter(
          item => item.id !== lagerItemDto.id
        );
        this.lagerService.deleteLagerItem(
          this.activeLager,
          lagerPlatzDto,
          lagerItemDto
        );
        this.updateDataSources();
      }
    });
  }
  deleteSlot(lagerPlatzDto: LagerPlatzDto) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: lagerPlatzDto
    });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        this.activeLager.platzs = this.activeLager.platzs.filter(
          platz => platz.id !== lagerPlatzDto.id
        );
        this.lagerService.deleteLagerPlatz(this.activeLager, lagerPlatzDto);
        this.updateDataSources();
      }
    });
  }
  deleteLager() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: this.activeLager
    });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        this.lagerService.deleteLager(this.activeLager);
        this.lagers = this.lagers.filter(
          lager => lager.id !== this.activeLager.id
        );
        this.setActiveLager(this.lagers[0]);
      }
    });
  }
  sortData(index: number, sort: Sort) {
    const data = this.activeLager.platzs[index].lagerItems;
    if (!sort.active || sort.direction === '') {
      this.dataSources[index] = new MatTableDataSource(data);
      return;
    }

    this.dataSources[index] = new MatTableDataSource(
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name':
            return compare(a.name, b.name, isAsc);
          case 'quantity':
            return compare(a.quantity, b.quantity, isAsc);
          default:
            return 0;
        }
      })
    );
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
