import { Component, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/Services/report.service';
import { ReportAdminService } from 'src/app/Services/report-admin.service';
import { Report } from 'src/app/models/report';
import { EventEmitter } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-reports-admin',
  templateUrl: './reports-admin.component.html',
  styleUrls: ['./reports-admin.component.scss']
})
export class ReportsAdminComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  showResult: boolean;
  allCategory: any;

  displayedColumns: any[] = [];

  constructor(
    public dialog: MatDialog,
    private reportAdminService: ReportAdminService,
    private userService: UserService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    const permissions = this.userService?.userSessionData?.data?.user?.roles?.map((t: any) => t.permissions.map((f: any) => f.id)).flat();
    let isManageReport = permissions?.some((item: any) => permissions?.includes('super-user') || permissions?.includes('manage-report'));
    if (isManageReport) {

      this.displayedColumns = [
        {name:'id', label:'Id'},
        {name:'name', label: 'Name'},
        {name:'title', label:'Title'},
        {name:'subTitleTemplateule', label: 'Template'},
        {name:'action', label:'Action'}]
        } else {
      this.displayedColumns = [
        {name:'id', label:'Id'},
        {name:'name', label: 'Name'},
        {name:'title', label:'Title'},
        {name:'subTitleTemplateule', label: 'Template'}]
      }
    this.reportAdminService.getAll().subscribe(
      (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res.data as Report[]);
          this.showResult = true;
        }
      }
    )
  }

  add(){
    this.router.navigate(["reports/add-report"]);
  }
  edit(id: any) {
    this.router.navigate([`reports/edit/`], this.dataSource.filteredData.find((r: { id: any; }) => r.id == id));
  }
  delete(id: any) {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { "msg": "Do you really want to delete the Report?", "type": "confirm"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportAdminService.deleteItem(id).subscribe(res => {
          if (res && res.success) {
            this.ngOnInit()
            this.dialog.open(DialogComponent, {
              width: "300px",
              data: { "msg": res.message, "type": "info"}
            });
          }
        })
      }
    });
  }
}
