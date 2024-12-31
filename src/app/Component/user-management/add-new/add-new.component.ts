import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { UserManagementService } from 'src/app/Services/user-management.service';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role';
import { RoleService } from 'src/app/Services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})

export class AddNewComponent implements OnInit {

  stored: any = [];
  ctrlPress = false;
  isMultidragging = false;
  disabled = false;
  mode = 'Add';

  @ViewChild(MatSort) sort: MatSort;
  showResult: boolean;
  addForm: any = FormGroup;
  userData: any = [];
  roles: Array<Role>;
  availableRoles: any = [];
  assignedRoles: any[] = [];
  tList: any = [];
  existingRoles: any = [];
  mobileNo: any;
  isView = false;
  private toast: ToastrService
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userManageSer: UserManagementService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.userData = this.router.getCurrentNavigation()?.extras;
    if (router.url.includes('view')) {
      this.isView = true;
    }
  }
  ngOnInit(): void {
    this.disabled = true;
    if (this.userData.id) {
      this.mode = 'Edit';
    }
    this.existingRoles = this.userData.roles;

    this.addForm = this.fb.group({
      userId: { value: this.userData.id, disabled: this.userData },
      name: { value: this.userData.name, disabled: this.isView },
      nick: { value: this.userData.userID ? this.userData.userID : this.userData.nick, disabled: this.isView || this.userData.userID || this.mode == 'Edit' },
      email: { value: this.userData.email, disabled: this.isView },
      mobileNo: { value: this.userData.mobileNo, disabled: this.isView },
      active: { value: this.userData.status == 'Active', disabled: this.isView }
    });

    this.roleService.getAllRoles().subscribe(
      res => {
        if (this.existingRoles?.length > 0) {
          let assignedRolesArray = this.existingRoles.split(',')
          assignedRolesArray.forEach((element: any) => {
            if (res.data.find((x: any) => x.name === element).length != 0) {
              this.assignedRoles.push(res.data.find((x: any) => x.name === element))
              res.data.forEach((item: any, index: any) => {
                if (item.name === element)
                  res.data.splice(index, 1);
              })

            }
          });
          this.roles = res.data;
        } else {
          this.roles = res.data;
        }
        this.tList = res.data;
        this.availableRoles = res.data.sort((a: { name: any; }, b: { name: any; }) => { return a.name.localeCompare(b.name) });
      },
    );
  }

  search() {
    this.showResult = true;
  }

  onSubmit() {


    if (this.addForm.invalid)
      return;
    let editedRoles: any[] = [];
    this.assignedRoles.forEach(item => {
      editedRoles.push({ id: item.id })
    })
    if (this.mode == 'Add') {
      let request = {
        nick: this.addForm.controls["nick"].value,
        email: this.addForm.controls["email"].value,
        name: this.addForm.controls["name"].value,
        mobileNo: this.addForm.controls["mobileNo"].value,
        active: this.addForm.controls["active"].value,
        roles: editedRoles,
        deleted: false,
        verified: true,
        loginAttempts: 0,
        authType: this.userData.userID ? 1 : 0
      };
      this.userManageSer.add(request).subscribe(
        data => {
          this.router.navigate(['user-management/user']);
        },
      );
    }
    else {
      let editedRoles: any[] = [];
      this.assignedRoles.forEach(item => {
        editedRoles.push({ id: item.id })
      })
      let request = {
        id: this.userData.id,
        nick: this.addForm.controls["nick"].value,
        email: this.addForm.controls["email"].value,
        name: this.addForm.controls["name"].value,
        mobileNo: this.addForm.controls["mobileNo"].value,
        active: this.addForm.controls["active"].value,
        roles: editedRoles,
        deleted: false,
        verified: true,
        loginAttempts: 0
      };
      this.userManageSer.update(request).subscribe(
        data => {
          this.router.navigate(['user-management/user']);
        },
      );
    }
  }
  onClose() {
    this.location.back();
  }
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.stored.length > 0) {
        event.previousContainer.data.slice(0).reverse().forEach(function (item, idx) {
          if (item.selected) {
            event.previousContainer.data.splice(event.previousContainer.data.indexOf(item), 1);

            event.container.data.splice(event.currentIndex, 0, item)
            event.container.data.forEach(function (d) {
              d.isMultidragging = false;
              d.selected = false;
            })

          }
        });
        this.stored = [];

      } else {

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }

    }
  }
  test(event: any) {

    if (this.ctrlPress !== false && this.stored.length > 0) {
      for (let item of event.source.dropContainer.data) {
        if (item.selected) {
          item.isMultidragging = true;
        } else {
          item.isMultidragging = false;
        }
      }
    }

  }
  onKeyDown(e: any, item: any, data: any) {
    this.ctrlPress = e.ctrlKey;
    if (e.ctrlKey && this.stored.indexOf(item) == -1) {
      item.selected = true;
      let idx = data.indexOf(item);
      item.selected = true;
      item.index = idx;

      this.stored.push(item)

    }
    else {
      item.selected = false;
      let idx = data.indexOf(item);
      item.selected = false;
      item.index = idx;

      this.stored.pop(item)

    }
  }
}
