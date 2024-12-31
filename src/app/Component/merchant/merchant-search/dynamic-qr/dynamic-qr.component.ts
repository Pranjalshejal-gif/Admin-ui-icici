import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { QRService } from 'src/app/Services/qr.service';
import { ShareQrComponent } from '../share-qr/share-qr.component';
import domtoimage from 'dom-to-image';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dynamic-qr',
  templateUrl: './dynamic-qr.component.html',
  styleUrls: ['./dynamic-qr.component.scss']
})
export class DynamicQrComponent implements OnInit {
  walletData:any;
  dynamicQRForm:FormGroup;
  showData: boolean = false;
  qrData:any;
  qrURL:any;
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(private fb: FormBuilder, public dialog: MatDialog, private toast: ToastrService, private qrService:QRService,
    
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.walletData = data?.walletData;
    }

  ngOnInit(): void {
    this.dynamicQRForm = this.fb.group ({
      amount: [''],
      tr: ['']
    });
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  generate() {
    if (!this.dynamicQRForm.invalid) {
      this.showData = true;
      let request = {
        "mid": this.walletData.mid,  //String
        "amount":this.dynamicQRForm.value?.amount, //String  ---Used for dynamic qr code generation
        "tr": this.dynamicQRForm.value?.tr ,//String  ---Used for tr geneartion
    };
      this.qrService.getAllWallet(request).subscribe((data: any) => {
        this.qrData = data;
        this.qrURL = data['qr-string'];
       }); 
    } else {
      this.showData = false;
    }
    
  }
  printQR(){
    window.print()
  }
  copyToClipboard(data:any) {

    navigator.clipboard.writeText(data)
    this.toast.success("copied");
  }
  downloadQR(){
    let downloadQRName = this.walletData.mid+"-"+this.walletData.customerDetails.name
    domtoimage.toBlob(document.getElementById('my-node-dynamic') as Node, { quality: 1 })
    .then(function (blob) {
        window.saveAs(blob, downloadQRName);
    });
  }
  share(){
    const dialogRef = this.dialog.open(ShareQrComponent, {
      width: '50%',
      data: {"qrData": this.qrData, 
            "walletData": this.walletData}
    });
  }
}
