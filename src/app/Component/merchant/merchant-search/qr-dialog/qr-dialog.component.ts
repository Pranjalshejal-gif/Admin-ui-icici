import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SafeUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { MerchantService } from "src/app/Services/merchant.service";
import { QRService } from "src/app/Services/qr.service";
import { DynamicQrComponent } from "../dynamic-qr/dynamic-qr.component";
import { ShareQrComponent } from "../share-qr/share-qr.component";
import domtoimage from 'dom-to-image';

@Component({
    selector: 'QR-code-dialog',
    templateUrl: './qr-dialog.component.html',
    styleUrls: ['./qr-dialog.component.scss']
  })
  export class QRCodeDialog  implements OnInit {
    
    walletData: any;
    qrData:any;
    qrURL:any;
    wallet: any;
    merchantData: any;
    isUpdate: boolean = false;
    WalletForm:any = FormGroup;
    public qrCodeDownloadLink: SafeUrl = "";
    
    constructor(private walletQR:QRService,private fb: FormBuilder, private toast: ToastrService, public dialog: MatDialog, private searchMerchant:MerchantService,
      public dialogRef: MatDialogRef<QRCodeDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {    
        this.walletData = data?.wallet;
    }
  ngOnInit(): void {
   // this.merchantData = this.searchMerchant.getAllMerchant()
   let request = {
      "mid": this.walletData.mid,  //String
      "amount":"", //String  ---Used for dynamic qr code generation
      "tr":"" //String  ---Used for tr geneartion
  };
   
    this.walletQR.getAllWallet(request).subscribe((data: any) => {
       this.qrData = data;
       this.qrURL = data['qr-string'];
      
      }); 
    
   this.qrCodeDownloadLink = this.walletData.qrUrl;
    this.WalletForm = this.fb.group ({
      externalMid: ['', Validators.required],
      externalTid: ['', Validators.required],
      linkedbank:['', Validators.required],
      sweepBalance: ['', Validators.required],
      inwardAllowed: ['', Validators.required],
      outwardAllowed: ['', Validators.required],
      refundAllowed: ['', Validators.required],
    });
    
  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
  downloadQR(){
    let downloadQRName = this.walletData.mid+"-"+this.walletData.customerDetails.name
    domtoimage.toBlob(document.getElementById('my-node') as Node, { quality: 1 })
    .then(function (blob) {
        window.saveAs(blob, downloadQRName);
    });
  }
  printQR(){
    window.print()
  }
  share(){
    const dialogRef = this.dialog.open(ShareQrComponent, {
      width: '50%',
      disableClose: true,
      data: {"qrData": this.qrData, 
              "walletData": this.walletData}
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  dynamicQr(evt:any) {
      const dialogRef = this.dialog.open(DynamicQrComponent, {
        width: '65%',
        disableClose: true,
        maxHeight: '600px',
        data: {"qrCodeUrl": this.qrCodeDownloadLink, 
        "walletData": this.walletData}
      });
      //dialogRef.componentInstance.merchantName = evt;
    
  }
  update(){
    this.isUpdate = true
  }
  copyToClipboard(data:any) {
    navigator.clipboard.writeText(data)
    this.toast.success("copied");
  }
 
 submit() {
    
    if (this.WalletForm.invalid) {
      return;
    } else {     
      this.isUpdate = false;
      this.walletQR.updateWallet(this.walletData) 
      this.toast.success("Data is updated");
        
    }
  }
}
  