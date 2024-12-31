import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/Services/permission.service';
import { RoleService } from 'src/app/Services/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit, OnDestroy {

  stored: any = [];
  ctrlPress = false;
  isMultidragging = false;
  availablePermissions: any = [];
  assignedPermissions: any = [];
  addForm: boolean = false;
  pickListForm: any = FormGroup;
  roleData: any;
  onDestroy = new Subject();
  isView = false;

  constructor(private fb: FormBuilder, private toast: ToastrService, private location: Location, private router: Router, private userPermission: PermissionService, private roles: RoleService) {
    this.roleData = this.router.getCurrentNavigation()?.extras;
    if (router.url.includes('view')) {
      this.isView = true;
    }

  }

  ngOnInit(): void {
    this.pickListForm = this.fb.group({
      name: { value: this.roleData && this.roleData.name, disabled: this.isView }
    });

    this.assignedPermissions = this.roleData?.permissions ?? [];
    const permissionsId = this.roleData.permissions?.map((d: any) => d.id);
    this.userPermission.getAll().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.availablePermissions = permissionsId ? res?.data?.filter((d: any) => permissionsId?.indexOf(d.id) === -1) : res.data;
    })
  }

  setRoles(roles: string) {
    var arrayRoles: { name: string; selected: boolean; }[] = [];
    roles?.trim().split(',').forEach(e => {
      arrayRoles.push({ "name": e, "selected": false });
    })
    return arrayRoles;
  }

  onSubmit() {
    if (this.pickListForm.invalid) {
      this.toast.error("Please Insert Valid Inputs");
      return;
    }
//Below condition is for select atleast one permission
    const assignedPermission = this.assignedPermissions.length
    if (assignedPermission == 0) {

      this.toast.error("Please Select atLeast one Permission")
      return;
    }

    const payload = {
      name: this.pickListForm.get('name').value,
      permissions: this.assignedPermissions.map((t: any) => {
        return { id: t.id };
      }),
      ...(this.roleData?.id) && { id: this.roleData?.id, makerOrChecker: "maker" }
    }

    if (this.roleData?.id) {
      this.roles.updateRole(payload).pipe(takeUntil(this.onDestroy)).subscribe(r => {
        this.router.navigate([`user-management/role`]);
      },
      );
    }
    else {
      this.roles.addRole(payload).pipe(takeUntil(this.onDestroy)).subscribe(r => {
        this.router.navigate([`user-management/role`]);
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
          event?.previousContainer.data,
          event?.container?.data,
          event?.previousIndex,
          event?.currentIndex
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

  ngOnDestroy() {
    this.onDestroy.next(true)
    this.onDestroy.complete()
  }

}


