import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountrydataComponent } from './components/countrydata/countrydata.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  {path: '',  redirectTo:'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'dashboard/:countryname', component: CountrydataComponent},
  { path: '**', component:NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
