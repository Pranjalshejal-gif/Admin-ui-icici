import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/Services/user-management.service';

@Component({
  selector: 'app-add-user-grid',
  templateUrl: './add-user-grid.component.html',
  styleUrls: ['./add-user-grid.component.scss']
})
export class AddUserGridComponent implements OnInit {
  displayedColumns: any[] = [
    {name:'userID', label:'user id'}, 
    {name:'name', label:'name'}, 
    {name:'email', label:'email'}, 
    {name:'action', label:'action'}];
  dataSource: MatTableDataSource<any>;
  hideRequiredControl = new FormControl(false);
  options = this._formBuilder.group({
    hideRequired: this.hideRequiredControl
  });
  expanded = true;
  showResult:boolean;
  userType: 'ldap' | 'nonldap' = 'ldap';
  searchForm: FormGroup;
  constructor(private _formBuilder: FormBuilder,private toast: ToastrService, private userManageSer: UserManagementService,
    private router:Router, private loc: Location) 
    {
      this.searchForm = this._formBuilder.group ({
        userId: [null,]
      });
     }

  ngOnInit(): void { }

  search() {
    if (this.searchForm.invalid) {
      return;
    }
    this.showResult = false;
    setTimeout(() => {
      this.userManageSer.searchLDAPUser(this.searchForm.get("userId")?.value).subscribe(r =>{
        if(r && r.success) {
          let arr = r.data;
          this.dataSource = new MatTableDataSource(arr);
          this.expanded = false;
          this.showResult = true;
        }
        else {
          this.dataSource = new MatTableDataSource(undefined);
          this.toast.error("No Matching record found");
        }
      });
    }, 100);
  }
  onSelect(id: any) {
    
    this.router.navigate([`user-management/add`], this.dataSource.filteredData.find(r => r.id == id));
  }
  addNew() {
    this.router.navigate([`user-management/add`]);
  }
  back() {
    this.loc.back();
  }
}
