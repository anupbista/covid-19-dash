import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import { MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';

const modules: any[] = [
  FlexLayoutModule,
  LayoutModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatCardModule,
  MatButtonModule,
  MatSortModule,
  MatPaginatorModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatTableModule,
  MatButtonToggleModule
];

@NgModule({
  imports: [ ...modules ],
  exports: [ ...modules ]
})
export class MaterialModule {}