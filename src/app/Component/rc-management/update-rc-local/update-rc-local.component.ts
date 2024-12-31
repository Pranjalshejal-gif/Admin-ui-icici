import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RcManagementService } from 'src/app/Services/rc-management.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-update-rc-local',
  templateUrl: './update-rc-local.component.html',
  styleUrls: ['./update-rc-local.component.scss']
})
export class UpdateRcLocalComponent implements OnInit {
  updateForm: FormGroup;
  dataSourceLocalRc: any = [];
  isValid: boolean = false;
  isInvalid: boolean = false;
  updateData: any = {};
  panelOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private searchRC: RcManagementService,
    private toast: ToastrService,
    private userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<UpdateRcLocalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateData = data?.data;
    this.dataSourceLocalRc = this.router.getCurrentNavigation()?.extras;
  }


  ngOnInit(): void {
    this.updateForm = this.fb.group({
      id: [{ value: this.updateData.id, disabled: true }],
      local: [{ value: this.updateData.local, disabled: true }],
      resultCode: this.updateData.resultCode,
      resultInfo: this.updateData.resultInfo
    })
  }
  submit() {
    if (this.updateForm.invalid) {
      return;
    }
    else {
      let request = {
        "id": this.updateData.id,
        "local": this.updateData.local,
        "resultCode": this.updateForm.value.resultCode,
        "resultInfo": this.updateForm.value.resultInfo,
      }
      this.searchRC.rcLocalUpdate(request).subscribe(
        data => {
          if (data && data.success) {
            this.dialogRef.close();
            this.userService.reloadCurrentRoute();
            this.panelOpen = false;
          }
          else {
            this.toast.error(data && data.message);
          }
        },
      )
    }
    this.isInvalid = false;
    this.isValid = false
  }

  onCancel() {
    this.dialogRef.close();
  }
}
