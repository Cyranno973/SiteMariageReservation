import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatCardModule
  ],
  exports: [
    MatToolbarModule, MatInputModule, MatButtonModule, MatDialogModule, MatFormFieldModule,MatSelectModule,MatOptionModule,
    MatTableModule, MatSortModule, MatIconModule, MatCardModule
  ],

})
export class MaterialModule {
}
