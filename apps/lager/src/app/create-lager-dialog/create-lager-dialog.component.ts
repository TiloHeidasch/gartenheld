import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lager-create-lager-dialog',
  templateUrl: './create-lager-dialog.component.html',
  styleUrls: ['./create-lager-dialog.component.scss']
})
export class CreateLagerDialogComponent {
  name;
  constructor(public dialogRef: MatDialogRef<CreateLagerDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
