import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'lager-create-lager-item-dialog',
  templateUrl: './create-lager-item-dialog.component.html',
  styleUrls: ['./create-lager-item-dialog.component.scss']
})
export class CreateLagerItemDialogComponent {
  data: { name; platz; quantity; unit } = {
    name: '',
    platz: this.platzs[0],
    quantity: 1,
    unit: ''
  };

  nameFormControl = new FormControl('', [Validators.required]);
  nameMatcher = new MyErrorStateMatcher();
  platzFormControl = new FormControl(this.platzs[0], [Validators.required]);
  platzMatcher = new MyErrorStateMatcher();
  quantityFormControl = new FormControl(1, [Validators.min(1)]);
  quantityMatcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<CreateLagerItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public platzs
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
