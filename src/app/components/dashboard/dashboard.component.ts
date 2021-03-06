import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SymptomsComponent } from './symptoms/symptoms.component';
import { PreventionComponent } from './prevention/prevention.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private _commonService: CommonService) { }

  ngOnInit(): void {
    this._commonService.country = null;
  }

  openSynptomsDialog(): void {
    const dialogRef = this.dialog.open(SymptomsComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPreventionDialog(): void {
    const dialogRef = this.dialog.open(PreventionComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
