import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { BulkPayoutService } from 'src/app/Services/bulk-payout.service';
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-payout-file-upload-dailog',
  templateUrl: './payout-file-upload-dailog.component.html',
  styleUrls: ['./payout-file-upload-dailog.component.scss']
})
export class PayoutFileUploadDailogComponent implements OnInit, OnDestroy {

  fileDetails: any
  timer: any;
  status: any;
  inProgress = true;
  completed = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private disbursmentSer: BulkPayoutService, private helper: HelperService, private dialogRef: MatDialogRef<PayoutFileUploadDailogComponent>) {
    this.fileDetails = data?.fileDetails;
  }

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus() {
    this.timer = setInterval(() => {
      this.disbursmentSer.getFileStatus(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
        this.status = res;
        if (res && res.status) {
          if (!(res.status.state == 'Queued' || res.status.state == 'Processing')) {
            this.inProgress = false;
            this.completed = true;
            clearTimeout(this.timer);
          }
        }
        else {
          this.inProgress = false;
          this.completed = true;
          clearTimeout(this.timer);
        }
      }, err => {
        this.closeDialog();
        this.inProgress = false;
        this.completed = true;
        clearTimeout(this.timer);

      })
    }, 3000);
  }
  download() {
    this.disbursmentSer.getReport(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.helper.errorResponse("Error downloading file!");
    }, err => {
      this.helper.errorResponse("Error downloading file!");
      this.closeDialog();
    });
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  closeDialog() {
    // Close the dialog
    this.dialogRef.close();
  }

}

