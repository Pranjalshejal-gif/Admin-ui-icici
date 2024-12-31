import { Component, OnInit, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from 'src/app/Services/user.service';
import { LoadCashbackService } from 'src/app/Services/load-cashback.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-load-dialog',
  templateUrl: './load-dialog.component.html',
  styleUrls: ['./load-dialog.component.scss']
})
export class LoadDialogComponent implements OnInit {

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
    private toast: ToastrService, private loadcashback: LoadCashbackService, private router: Router,
    public dialogRef: MatDialogRef<LoadDialogComponent>, private userService: UserService) {
    this.payloadReq = data?.payload;
  }

  ngOnInit(): void {
    this.AppRej = this.fb.group({
      remarks: [null, [Validators.pattern(RegularExpression.REMARKS_REGEX)]],

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
          this.payloadReq.status = "A";
          this.loadcashback.loadapprove(this.payloadReq).subscribe(res => {
            this.userService.reloadCurrentRoute();
            this.dialogRef.close();
          })
        }
        else if (this.action == 'R') {
          this.payloadReq.status = "R";
          this.loadcashback.loadreject(this.payloadReq).subscribe(res => {
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


