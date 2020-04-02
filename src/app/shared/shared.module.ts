import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataloadingComponent } from './components/dataloading/dataloading.component';

@NgModule({
  declarations: [DataloadingComponent],
  imports: [
    CommonModule
  ],
  exports: [DataloadingComponent]
})
export class SharedModule { }
