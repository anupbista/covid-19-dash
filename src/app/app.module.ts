import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { CaseCountComponent } from './components/dashboard/case-count/case-count.component';
import { HttpService } from './services/http.service';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { WorldMapComponent } from './components/dashboard/world-map/world-map.component';
import { WorldDatatableComponent } from './components/dashboard/world-datatable/world-datatable.component';
import { LineChartComponent } from './components/dashboard/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CaseCountComponent,
    WorldMapComponent,
    WorldDatatableComponent,
    LineChartComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [HttpService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
