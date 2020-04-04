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
import { SymptomsComponent } from './components/dashboard/symptoms/symptoms.component';
import { PreventionComponent } from './components/dashboard/prevention/prevention.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DailyUpdatesComponent } from './components/dashboard/daily-updates/daily-updates.component';
import { WeeklyUpdatesComponent } from './components/dashboard/weekly-updates/weekly-updates.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CaseCountComponent,
    WorldMapComponent,
    WorldDatatableComponent,
    LineChartComponent,
    SymptomsComponent,
    PreventionComponent,
    FooterComponent,
    HeaderComponent,
    DailyUpdatesComponent,
    WeeklyUpdatesComponent
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
  entryComponents: [SymptomsComponent, PreventionComponent],
  providers: [HttpService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
