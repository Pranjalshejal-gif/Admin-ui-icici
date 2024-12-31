import { Component, OnInit, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApproveRefundPayoutService } from 'src/app/Services/approve-refund-payout.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-apprej-dialog',
  templateUrl: './apprej-dialog.component.html',
  styleUrls: ['./apprej-dialog.component.scss']
})
export class ApprejDialogComponent implements OnInit {

  AppRej: any = FormGroup;
  TxnDetails: any;
  payloadReq: any;
  remarks: any = "";
  isUpdate: boolean = true;
  txnCount: number;
  action: string;
  initPayloadReq: any;
  dataSource: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private fb: FormBuilder,
    private toast: ToastrService, private addrefSer: ApproveRefundPayoutService, private router: Router,
    public dialogRef: MatDialogRef<ApprejDialogComponent>, private userService: UserService) {
    this.payloadReq = data?.payload;
  }

  ngOnInit(): void {
    this.AppRej = this.fb.group({
      remarks: [null, [Validators.pattern(RegularExpression.REMARKS_REGEX)]]
    })
  }

  submit() {
    if (this.AppRej.invalid) {
      return;
    }
    else {
      this.txnCount = this.payloadReq.indexIds.length;
      if (this.txnCount == 0) {
        this.toast.error('Please select atleast 1 transaction.');
      } else {
        this.payloadReq.remarks = this.remarks;
        this.action = this.payloadReq.action
        if (this.action == 'A') {
          this.addrefSer.approve(this.payloadReq).subscribe(res => {

            this.userService.reloadCurrentRoute();
            this.dialogRef.close();
          })
        }
        else if (this.action == 'R') {
          this.addrefSer.reject(this.payloadReq).subscribe(res => {
            this.userService.reloadCurrentRoute();
            this.dialogRef.close();
          })
        }
        else {

          this.toast.error("Not Implemented!!");
        }
      }
    }
  }
}

