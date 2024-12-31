import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Permission } from 'src/app/models/permission';
import { PermissionService } from 'src/app/Services/permission.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {

  displayedColumns: any[] = [
    {name:'id', label:'Id'},
    {name:'value', label:'Name'}];
  dataSource: MatTableDataSource<any>;
  showResult:boolean;
  error = "";

  constructor(
    private permissionService: PermissionService,
    private router:Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.error = "";
    this.permissionService.getAll().subscribe(
      (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res.data as Permission[]);
          this.showResult = true;
        }
      },
    );
  }
  edit(id: any) {
    this.router.navigate([`user-management/permission/edit/${id}`], this.dataSource.filteredData.find(r => r.id == id));
  }
  view(id: any) {
    this.router.navigate([`user-management/permission/view/${id}`], this.dataSource.filteredData.find(r => r.id == id));
  }
}
