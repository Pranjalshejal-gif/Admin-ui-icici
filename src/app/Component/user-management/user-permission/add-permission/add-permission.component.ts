import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Permission } from 'src/app/models/permission';
import { PermissionService } from 'src/app/Services/permission.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent implements OnInit {

  addForm:any =FormGroup;
  permData:any;
  idDisabled:boolean;
  permission: Permission;
  isView = false;

  constructor(
    private fb: FormBuilder, 
    private location: Location, 
    private router:Router,
    private permissionService: PermissionService,
  ) { 
    this.permData = this.router.getCurrentNavigation()?.extras;
    if(router.url.includes('view')) {
      this.isView = true;
    }
  }

  ngOnInit(): void {
    this.idDisabled = this.permData ? true : false;
    this.addForm = this.fb.group({
      id: new FormControl({ value: this.permData && this.permData.id, disabled: this.idDisabled }, Validators.required),
      val: new FormControl({ value: this.permData && this.permData.value, disabled: this.isView }, Validators.required)
    });
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.addForm.invalid) {
      return;
    }
    
    let request = {
      id: this.permData.id,
      value: this.addForm.value.val, 
    };

    this.permissionService.update(request).subscribe(
      data => {
          this.router.navigate([`user-management/permission`]);
      },
    );
  }
  onClose() {
    this.location.back(); 
  }
}
