import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/Services/shared.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { HelperService } from 'src/app/Services/helper.service';
import * as FileSaver from 'file-saver';
import { SearchHistory } from 'src/app/Services/bulk-history.service';
import { BulkPayoutService } from 'src/app/Services/bulk-payout.service';
import { PayoutFileUploadDailogComponent } from '../payout-file-upload-dailog/payout-file-upload-dailog.component';

@Component({
  selector: 'app-payout-bulk-upload',
  templateUrl: './payout-bulk-upload.component.html',
  styleUrls: ['./payout-bulk-upload.component.scss']
})
export class PayoutBulkUploadComponent implements OnInit {
  dataSourceDisbursment: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: SearchHistory[];
  file: File;
  showData: boolean = true; // Initialize to false   
  customer: any = {};
  constructor(private helper: HelperService, private disbursment: BulkPayoutService,
    public dialog: MatDialog, private sharedService: SharedService, private user: UserService, private router: Router, private helperService: HelperService) {
    this.customer = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.Columns = this.disbursment.historyColumns;
    this.bulkHistory();

  }

  bulkHistory() {
    this.disbursment.bulkHistroy(this.customer.mid).subscribe(res => {
      if (res && res.success) {
        var arr: SearchHistory[] = res.data;
        arr.forEach((obj: any) => {

          obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
        });

        this.dataSourceDisbursment = new MatTableDataSource(res.data);
        this.atLeastOneRequired = true;
        this.showData = true;

      }
    });
  }

  upload() {
    // Set the merchant ID (mid) in the SharedService based on the customer's mid.
    // This is done before initiating the file upload process.
    this.sharedService.setMid(this.customer.mid);
    this.disbursment.DisbursmentuploadFileAndData(this.file).subscribe(
      res => {
        if (res && res.success) {
          const dialogRef = this.dialog.open(PayoutFileUploadDailogComponent, {
            width: '60%',
            data: { "fileDetails": res },
            autoFocus: false,
            maxHeight: '400px'
          });

          dialogRef.afterClosed().subscribe(result => {
            this.bulkHistory();
          });

        }
        else
          this.helper.errorResponse(res.msg);
      });
  }

  readFile(event: any) {
    this.file = event.target.files[0];
  }
}