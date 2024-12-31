import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-disbursement-file-upload-dialog',
  templateUrl: './disbursement-file-upload-dialog.component.html',
  styleUrls: ['./disbursement-file-upload-dialog.component.scss']
})
export class DisbursementFileUploadDialogComponent implements OnInit {

  fileDetails: any
  timer: any;
  status: any;
  inProgress = true;
  completed = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private pcbdcService: PcbdcService, private toast: ToastrService,
    private userService: UserService, private dialogRef: MatDialogRef<DisbursementFileUploadDialogComponent>) {
    this.fileDetails = data?.fileDetails;
  }

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus() {
    this.timer = setInterval(() => {
      var subs = this.pcbdcService.getFileStatus(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
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
    this.pcbdcService.getReport(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
        this.dialogRef.close();
        this.userService.reloadCurrentRoute();
      }
      else {
        this.toast.error("Error downloading file!");
        this.dialogRef.close();
        this.userService.reloadCurrentRoute();
      }
    }, err => {
      this.toast.error("Error downloading file!");
      this.dialogRef.close();
      this.userService.reloadCurrentRoute();
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  onCancel() {
    this.userService.reloadCurrentRoute();
  }
}
