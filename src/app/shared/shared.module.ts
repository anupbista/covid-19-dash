import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataloadingComponent } from './components/dataloading/dataloading.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [DataloadingComponent, ErrorComponent],
  imports: [
    CommonModule
  ],
  exports: [DataloadingComponent, ErrorComponent]
})
export class SharedModule { }
