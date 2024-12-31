import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MerchantData } from 'src/app/models/merchantData';
import { MerchantService } from 'src/app/Services/merchant.service';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { SharedService } from 'src/app/Services/shared.service';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
  file:File;
  showData:boolean;
  excelData:MerchantData[] = [];
  fileData: MatTableDataSource<any>;
  timer: any;
  columns:any[] = [
    {name:'name',label:'Merchant Name'},
    {name:'legalName',label:'Legal Name'},
    {name:'contactNumber',label:'Contact Number'},
    {name:'registeredContactNumber',label:'Registered Contact Number'},
    {name:'email',label:'Email'},
    {name:'mcc',label:'MCC'},
    {name:'bankAccount',label:'Bank Account'},
    {name:'ifsc',label:'IFSC'},
    {name:'pan',label:'Pan'},
    {name:'walletId',label:'Preferred Wallet Name'},
    {name:'boardingType',label:'Boarding Type'},
    {name:'ownershipType',label:'Ownership Type'},
    {name:'registeredAddress',label:'Registered Address'},
    {name:'inwardCollectionAllowed',label:'Inward Fund Allowed'},
    {name:'outwardTransaction',label:'Outward Transaction'},
    {name:'refundAllowed',label:'Refund Allowed'},
    {name:'sweepBalance',label:'Merchant Auto Sweep'},
    {name:'notifySms',label:'Sms Notification'},
    {name:'notifyCallback',label:'CallBack Notification'},
    {name:'callbackInAuthLeg',label:'CallBack in Auth Notification'},
    { name: 'genere', label: 'Genere' },
     {name:'gstin',label:'GSTIN'},
     {name:' BranchCode',label:'Branch Code'}

  ];
  constructor(private merchantSer:MerchantService, private toast: ToastrService, private sharedService: SharedService,
    public dialog: MatDialog) { }

  upload() {
    this.sharedService.setTxntype(Constants.MERCHANT_BULK_UPLOAD_TEMPLATE_ICICI);
    this.merchantSer.uploadFileAndData(this.file).subscribe(
      res => {
        if (res && res.success){
          const dialogRef = this.dialog.open(FileUploadDialogComponent, {
            width: '60%',
            data: {"fileDetails": res},
            autoFocus: false,
            maxHeight: '400px'
          });
        }
        else
        this.toast.error(res.msg);
      },err => {
         console.log(err);
      });
  }
  readFile(event:any) {
    this.file = event.target.files[0];
  }
}
