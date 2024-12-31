import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { UserService } from 'src/app/Services/user.service';

export class ReqCheckStatus {
  amount: string
  denominations: string;
  reasons: string;
  status: string

  constructor(status: string, amount: string, reasons: string, denominations: string) {
    this.amount = amount;
    this.reasons = reasons;
    this.denominations = denominations;
    this.status = status;
  }
}

@Component({
  selector: 'app-pcbdc-conversion-status-dialog',
  templateUrl: './pcbdc-conversion-status-dialog.component.html',
  styleUrls: ['./pcbdc-conversion-status-dialog.component.scss']
})
export class PcbdcConversionStatusDialogComponent implements OnInit {

  respData: any = {};
  statusArray: ReqCheckStatus[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private pcbdcService: PcbdcService, private userService: UserService,
    private toast: ToastrService, public dialogRef: MatDialogRef<PcbdcConversionStatusDialogComponent>) { }

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus() {
    let request = {
      requisitionId: this.data.row.id,
      ruleId: this.data.row.ruleId
    }
    this.pcbdcService.checkStatus(request).subscribe(
      res => {
        if (res && res.success) {
          this.respData = res.data;
          var statusJson = this.respData.data.requisitionStatus;
          if (statusJson.COMPLETED) {
            var completedJson = statusJson.COMPLETED
            var completedReqCheckStatus = new ReqCheckStatus('COMPLETED', completedJson.amount, completedJson.reasons, completedJson.denominations)
            this.statusArray.push(completedReqCheckStatus);
          } if (statusJson.FAILED) {
            var failedJson = statusJson.FAILED
            var failedReqCheckStatus = new ReqCheckStatus('FAILED', failedJson.amount, failedJson.reasons, failedJson.denominations)
            this.statusArray.push(failedReqCheckStatus);
          } if (statusJson.PENDING) {
            var pendingJson = statusJson.PENDING
            var pendingReqCheckStatus = new ReqCheckStatus('PENDING', pendingJson.amount, pendingJson.reasons, pendingJson.denominations)
            this.statusArray.push(pendingReqCheckStatus);
          } if (statusJson.ALLOCATED) {
            var allocatedJson = statusJson.ALLOCATED
            var aloocatedReqCheckStatus = new ReqCheckStatus('ALLOCATED', allocatedJson.amount, allocatedJson.reasons, allocatedJson.denominations)
            this.statusArray.push(aloocatedReqCheckStatus);
          }
        }
        else {
          this.dialogRef.close();
          this.userService.reloadCurrentRoute();
          this.toast.error(res.message);
        }
      },
    );
  }

  onClose() {
    this.userService.reloadCurrentRoute();
  }
}