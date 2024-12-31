import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-add-blacklist-customer-dialog',
  templateUrl: './add-blacklist-customer-dialog.component.html',
  styleUrls: ['./add-blacklist-customer-dialog.component.scss']
})
export class AddBlacklistCustomerDialogComponent implements OnInit {

  addForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddBlacklistCustomerDialogComponent>,
    private blacklistCustServ : BlacklistCustomerService, private userService: UserService, private toast: ToastrService, private router: Router
  ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      blockType: [{ value: 'MOBILE', disabled: true }],
      blockValue: ['', [Validators.required, Validators.pattern]],
      updatedReason: ['', [Validators.required, Validators.pattern]],
      srNumber: [''],
      status: [{ value: 'BLOCK', disabled: true }, [Validators.required, Validators.pattern]]
    })
  }

  submit() {
    if (this.addForm.invalid) {
      return;
    } else {
      let request = {
        "blockType": 'MOBILE',
        "blockValue": this.addForm.value.blockValue,
        "updatedReason": this.addForm.value.updatedReason,
        "srNumber": this.addForm.value.srNumber,
        "status": 'B',
      }
      this.blacklistCustServ.addBlacklistCustomer(request).subscribe(
        data => {
          if (data && data.success) {
            this.dialogRef.close();
            this.userService.reloadCurrentRoute();
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