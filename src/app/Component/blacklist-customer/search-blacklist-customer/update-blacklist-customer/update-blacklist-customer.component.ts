import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-update-blacklist-customer',
  templateUrl: './update-blacklist-customer.component.html',
  styleUrls: ['./update-blacklist-customer.component.scss']
})
export class UpdateBlacklistCustomerComponent implements OnInit {

  updateForm: FormGroup;
  dataSourceLocalRc: any = [];
  updateData: any = {};
  panelOpen: boolean = true;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService,
    private router: Router,
    public blacklistCustSer : BlacklistCustomerService,
    public dialogRef: MatDialogRef<UpdateBlacklistCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateData = data?.data;
    this.dataSourceLocalRc = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      id: [{ value: this.updateData.id, disabled: true }],
      blockType: [{ value: 'MOBILE', disabled: true }],
      blockValue: [{ value: this.updateData.blockValue, disabled: true }],
      updatedReason: [this.updateData.updatedReason, [Validators.required]],
      status: [this.updateData.status.substring(0, 1), [Validators.required]],
      srNumber:[this.updateData.srNumber]
    })
  }

  submit() {
    if (this.updateForm.invalid) {
      return;
    }
    else {
      let request = {
        "id": this.updateData.id,
        "blockType": 'MOBILE',
        "blockValue": this.updateData.blockValue,
        "updatedReason": this.updateForm.value.updatedReason,
        "status": this.updateForm.value.status,
        "srNumber": this.updateForm.value.srNumber
      }
      this.blacklistCustSer.updateBlacklistCustomer(request).subscribe(
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
  }

  onCancel() {
    this.dialogRef.close();
  }
}