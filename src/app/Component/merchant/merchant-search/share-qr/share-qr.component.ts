import { HttpHeaders } from '@angular/common/http';
import { Component, ContentChild, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { QRService } from 'src/app/Services/qr.service';

@Component({
  selector: 'app-share-qr',
  templateUrl: './share-qr.component.html',
  styleUrls: ['./share-qr.component.scss']
})
export class ShareQrComponent implements OnInit {

  shareQRForm:FormGroup;
  walletData: any;
  isValid:boolean = false
  isInvalid:boolean = false
  public qrCodeDownloadLink: SafeUrl = "";
  qrURL:any;
  qrData:any;
  file:File

  constructor(private fb: FormBuilder, private toast: ToastrService, public dialogRef: MatDialogRef<ShareQrComponent>,
    private walletQR:QRService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.walletData = data.walletData;
      this.qrData = data.qrData;
     }

  ngOnInit(): void {
    this.shareQRForm = this.fb.group ({
      to: ['',[ Validators.required, Validators.email]],
      from: ['',[ Validators.required, Validators.email]],
      subject: [''],
      message: [''],
    });

  }

  send() {
    if (this.shareQRForm.invalid) {
      return;
    } else {   
      let qr = {
        to:this.shareQRForm.value.to,
        from:this.shareQRForm.value.from,
        password:"Prashant@123",
        subject:this.shareQRForm.value.subject,
        message:this.shareQRForm.value.message,
      }
     
      let file = new File([this.qrData.data], 'qr.jpeg', {lastModified:new Date().getTime(), type:'image/jpeg,base64'})
      let request = {
        file:file,
        qr:qr
      }
      this.walletQR.shareQr(request).subscribe(
        data => {},
      );       
      
      this.dialogRef.close();
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  

}
