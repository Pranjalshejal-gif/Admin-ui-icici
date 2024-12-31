import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportCategory } from 'src/app/models/report-category';
import { ReportCategoryService } from 'src/app/Services/report-category.service';
import { ReportsService } from 'src/app/Services/report.service';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';


@Component({
  selector: 'app-report-category',
  templateUrl: './report-category.component.html',
  styleUrls: ['./report-category.component.scss']
})
export class ReportCategoryComponent implements OnInit {

  columns: any[] = [
    {name:'id', label:'Id'},
    {name:'title', label: 'Title'},
    {name:'showAsSubmenu', label:'Show As Submenu'},
    {name:'action', label:'Action'}]
  dataSource: MatTableDataSource<any>;
  showResult:boolean;

  constructor(private reportCategoryService:ReportCategoryService,
    private router:Router, public dialog: MatDialog) { }

    ngOnInit(): void {

      this.reportCategoryService.getAll().subscribe(
        (res) => {
          if(res) {
            this.dataSource = new MatTableDataSource(res.data as ReportCategory[]);
            this.showResult = true;
            }
        }
      )
    }
    add() {
      this.router.navigate([`reports/report-category/add`]);
    }
    edit(id: any) {
      this.router.navigate([`reports/report-category/edit`], this.dataSource.filteredData.find(r => r.id == id));
    }
    view(id: any) {
      this.router.navigate([`reports/report-category/view`], this.dataSource.filteredData.find(r => r.id == id));
    }
    delete(id:any) {
      let dialogRef = this.dialog.open(DialogComponent, {
        width: "300px",
        data: {"msg": "Do you really want to delete the Category?", "type": "confirm"}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportCategoryService.deleteItem(id).subscribe(res => {
            if (res && res.success) {
              this.ngOnInit()
              this.dialog.open(DialogComponent, {
                width: "300px",
                data: {"msg": res.message, "type": "info"}
              });
            }
          })
        }
      });

    }
}
