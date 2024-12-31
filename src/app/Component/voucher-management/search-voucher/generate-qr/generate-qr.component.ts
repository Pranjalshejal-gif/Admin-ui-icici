import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VoucherService } from 'src/app/Services/voucher.service';

@Component({
  selector: 'app-generate-qr',
  templateUrl: './generate-qr.component.html',
  styleUrls: ['./generate-qr.component.scss']
})
export class GenerateQrComponent implements OnInit {

  voucherCode: any;
  redeemDate: any;
  qrData: any;
  expirationDate: any;
  status: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private voucherService: VoucherService, private datePipe: DatePipe) {
    this.voucherCode = data.voucherData.code;
    this.redeemDate = data.voucherData.redeemDate;
    this.expirationDate = this.datePipe?.transform(data.voucherData.expirationDate, 'dd-MM-yyyy');
    this.status = data.voucherData.status;
  }

  ngOnInit(): void {
    let request = {
      "voucherCode": this.voucherCode,
    };
    this.voucherService.getVoucherQR(request).subscribe((data: any) => {
      this.qrData = data;
    });
  }

  printQR() {
    window.print()
  }
}
