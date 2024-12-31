import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/Services/config.service';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';
import { DailogConfigComponent } from './dailog-config/dailog-config.component';

@Component({
  selector: 'app-meta-config',
  templateUrl: './meta-config.component.html',
  styleUrls: ['./meta-config.component.scss']
})
export class MetaConfigComponent implements OnInit {

  Columns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'key', label: 'name' },
    { name: 'value', label: 'value' },
    { name: 'action', label: 'Action' }]
  dataSource: MatTableDataSource<any>;
  showResult: boolean;
  meta: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
    private config: ConfigService,
    private router: Router,
    public dialogg: MatDialog) { }

  ngOnInit(): void {

    this.config.get().subscribe(
      (res) => {
        if (res) {
          let data: Config[] = res as Config[];
          data.forEach((element: Config) => {
            element.key = element.key.substring('meta.data.'.length);

          })
          this.dataSource = new MatTableDataSource(data);
          this.showResult = true;
          
        }
      }
    )
  }

  add() {
    this.router.navigate([`meta-config/add`]);
  }

  edit(data: any) {
    this.dialogg.open(DailogConfigComponent, {
      width: '30%',
      data: this.dataSource.filteredData.find(r => r.id == data)
    }), this.dataSource.filteredData.find(r => r.id == data);

  }

  view(id: any) {
    this.router.navigate([`meta-config/view`]), this.dataSource.filteredData.find(r => r.id == id);
  }

  openDialog() {
    this.dialog.open(DailogConfigComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val == 'save') {
        this.get();
      }
    })
  }

  get() {
    this.config.get().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert("Error while fetching the data");
      }
    });
  }

  delete(id: any) {
    let dialogRef = this.dialogg.open(DialogComponent, {
      width: "300px",
      data: { "msg": "Do you really want to delete the Record?", "type": "confirm" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.config.deleteItem(id).subscribe(res => {
          if (res && res.success) {
            this.ngOnInit()
            this.dialogg.open(DialogComponent, {
              width: "300px",
              data: { "msg": res.message, "type": "info" }
            });
          }
        })
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addg() {
    this.dialogg.open(DailogConfigComponent)
  }

}
