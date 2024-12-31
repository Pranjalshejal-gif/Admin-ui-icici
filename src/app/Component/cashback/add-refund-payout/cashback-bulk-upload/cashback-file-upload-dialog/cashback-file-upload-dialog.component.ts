import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RefundPayoutService } from 'src/app/Services/refund-payout.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-cashback-file-upload-dialog',
  templateUrl: './cashback-file-upload-dialog.component.html',
  styleUrls: ['./cashback-file-upload-dialog.component.scss']
})
export class CashbackFileUploadDialogComponent implements OnInit, OnDestroy {

  fileDetails: any
  timer: any;
  status: any;
  inProgress = true;
  completed = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private refSer: RefundPayoutService, private toast: ToastrService) {
    this.fileDetails = data?.fileDetails;
  }

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus() {
    this.timer = setInterval(() => {
      var subs = this.refSer.getFileStatus(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
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
        this.inProgress = false;
        this.completed = true;
        clearTimeout(this.timer);
        console.log(err);
      })
    }, 3000);
  }
  download() {
    this.refSer.getReport(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.toast.error("Error downloading file!");
    }, err => {
      this.toast.error("Error downloading file!");
    });
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
