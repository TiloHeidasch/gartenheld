import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lager-create-lager-platz-dialog',
  templateUrl: './create-lager-platz-dialog.component.html',
  styleUrls: ['./create-lager-platz-dialog.component.scss']
})
export class CreateLagerPlatzDialogComponent {
  name;
  constructor(
    public dialogRef: MatDialogRef<CreateLagerPlatzDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
