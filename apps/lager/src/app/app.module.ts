import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CreateLagerDialogComponent } from './create-lager-dialog/create-lager-dialog.component';
import { CreateLagerPlatzDialogComponent } from './create-lager-platz-dialog/create-lager-platz-dialog.component';
import { CreateLagerItemDialogComponent } from './create-lager-item-dialog/create-lager-item-dialog.component';
import { EditNameDialogComponent } from './edit-name-dialog/edit-name-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateLagerDialogComponent,
    CreateLagerPlatzDialogComponent,
    CreateLagerItemDialogComponent,
    EditNameDialogComponent,
    DeleteConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
