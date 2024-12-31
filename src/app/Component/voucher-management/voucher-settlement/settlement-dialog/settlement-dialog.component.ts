import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { VoucherService } from 'src/app/Services/voucher.service';
import { Constants } from 'src/app/Shared/constants';
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-settlement-dialog',
  templateUrl: './settlement-dialog.component.html',
  styleUrls: ['./settlement-dialog.component.scss']
})

export class SettlementDialogComponent implements OnInit {
  settleForm: any = FormGroup;
  payloadReq: any;
  remarks: any = "";

  constructor(public dialogRef: MatDialogRef<SettlementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService,
    private voucherService: VoucherService,
    private helper: HelperService) {
    this.payloadReq = data.voucherData;
  }

  ngOnInit(): void {
    this.settleForm = this.fb.group({
      remarks: [null, [Validators.required, Validators.pattern(RegularExpression.REMARK)]],
    })
  }

  submit() {
    if (this.settleForm.invalid) {
      this.helper.errorResponse(Constants.INVALID_FORM_MSG)
      return;
    }
    let request = {
      id: this.payloadReq,
      remarks: this.settleForm.value.remarks,
      status: 'S'
    }
    this.voucherService.updateUnsettledTxn(request).subscribe(data => {
      if (data && data.success) {
        this.dialogRef.close();
        this.userService.reloadCurrentRoute();
      }
      else {
        this.helper.errorResponse(data.message);
      }
    });
  }
}