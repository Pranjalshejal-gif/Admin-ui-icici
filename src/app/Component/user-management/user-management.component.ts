import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserData, UserRoles, UserTableData } from 'src/app/models/user_data';
import { UserManagementService } from 'src/app/Services/user-management.service';
import { DialogComponent } from 'src/app/Shared/dialog/dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userData: MatTableDataSource<any>;
  expanded = true;
  showResult: boolean;
  columns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'nick', label: 'Username' },
    { name: 'email', label: 'Email' },
    { name: 'mobileNo', label: 'Mobile No' },
    { name: 'roles', label: 'Roles' },
    { name: 'lastActivity', label: 'Last Activity Date' },
    { name: 'status', label: 'Status' },
    { name: 'userAction', label: 'Action' }];
  roles: UserRoles[];
  constructor(private _formBuilder: FormBuilder, private userManageSer: UserManagementService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.search();
  }
  search() {
    this.showResult = false;
    this.userManageSer.search("").subscribe(r => {

      if (r && r.success) {
        var arr: UserData[] = r.data;
        arr.forEach((obj: any) => {
          obj.status = obj.loginAttempts >= 3 ? 'Locked' : obj.active ? 'Active' : 'Inactive';
          this.roles = obj.roles;
          let names = this.roles.map(item => item.name)
          obj.roles = names.join(',');
        });
        this.userData = new MatTableDataSource(arr);
        this.userData.filterPredicate = this.customFilterPredicate();
        this.expanded = false;
        this.showResult = true;
      }
    });
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: UserTableData, filter: string): boolean {
      let searchString = filter.trim().toLowerCase();
      return data.id?.toString().trim().indexOf(searchString) !== -1 ||
        data.name?.toString().trim().toLowerCase().indexOf(searchString) !== -1 ||
        data.nick?.toString().trim().toLowerCase().indexOf(searchString) !== -1 ||
        (data.mobileNo != null && data.mobileNo?.toString().trim().indexOf(searchString) !== -1) ||
        data.roles?.toString().trim().toLowerCase().indexOf(searchString) !== -1;
    }
    return myFilterPredicate;
  }

  add() {
    this.router.navigate(["user-management/add-user"]);
  }

  edit(id: any) {

    this.router.navigate([`user-management/edit/${id}`], this.userData.filteredData.find(r => r.id == id));
  }

  view(id: any) {

    this.router.navigate([`user-management/view/${id}`], this.userData.filteredData.find(r => r.id == id));
  }

  delete(id: any) {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { "msg": "Do you really want to delete the user?", "type": "confirm" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManageSer.deleteUser(id).subscribe(
          data => {


            this.search()
          },
        );
      }
    });
  }
  unlock(id: any) {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { "msg": "Do you really want to unlock the user?", "type": "confirm" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManageSer.unlockUser(id).subscribe(res => {
          if (res && res.success) {
            this.search();
            this.dialog.open(DialogComponent, {
              width: "300px",
              data: { "msg": "User has been unlocked successfully", "type": "info" }
            });
          }
        });
      }
    });
  }
}
