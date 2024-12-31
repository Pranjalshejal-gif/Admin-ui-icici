import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from 'src/app/Services/user.service';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-disbursement-remark-dialog',
  templateUrl: './disbursement-remark-dialog.component.html',
  styleUrls: ['./disbursement-remark-dialog.component.scss']
})
export class DisbursementRemarkDialogComponent implements OnInit {

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
    private toast: ToastrService, private pcbdcService: PcbdcService, private router: Router,
    public dialogRef: MatDialogRef<DisbursementRemarkDialogComponent>, private userService: UserService) {
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
      this.payloadReq.remarks = this.remarks;
      this.action = this.payloadReq.action
      if (this.action == 'A') {
        this.payloadReq.status = "A";
        let request = {
          id: this.payloadReq.indexIds
        }
        this.pcbdcService.approveDisbursement(request).subscribe(res => {
          this.dialogRef.close();
          this.userService.reloadCurrentRoute();
        })
      }
      else if (this.action == 'R') {
        let request = {
          id: this.payloadReq.indexIds,
          remarks: this.payloadReq.remarks
        }
        this.payloadReq.status = "R";
        this.pcbdcService.rejectDisbursement(request).subscribe(res => {
          this.dialogRef.close();
          this.userService.reloadCurrentRoute();
        })
      }
      else {
        this.toast.error("Not Implemented!!");
      }
    }
  }
}