import { Component, Inject,OnDestroy,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from 'src/app/Services/merchant.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit,OnDestroy {

  fileDetails: any
  timer:any;
  status:any;
  inProgress= true;
  completed = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private merchantSer:MerchantService, private toast: ToastrService) {
    this.fileDetails = data?.fileDetails;
   }

  ngOnInit(): void {
    this.checkStatus();
  }

  checkStatus() {
    this.timer = setInterval(() => {
      var subs = this.merchantSer.getFileStatus(this.fileDetails.token, this.fileDetails.id).subscribe(res => {
        this.status = res;
        if (res && res.status){
          if(!(res.status.state == 'Queued' || res.status.state == 'Processing')) {
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
      },err => {
        this.inProgress = false;
        this.completed = true;
        clearTimeout(this.timer);
        console.log(err);
      })  
    }, 3000);
  }
  download() {
    this.merchantSer.getReport(this.fileDetails.token, this.fileDetails.id).subscribe(res =>{
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
      .replace("\"","").replace("\"","").replace('xlsx','xls');
      if (fileName){
        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.toast.error("Error downloading file!");
    },err => {
      this.toast.error("Error downloading file!");
    });
  }
  ngOnDestroy() {
    clearTimeout(this.timer);
  }
}
