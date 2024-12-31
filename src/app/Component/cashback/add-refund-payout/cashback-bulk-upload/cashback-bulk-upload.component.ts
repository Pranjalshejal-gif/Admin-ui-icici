import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RefundPayoutService } from 'src/app/Services/refund-payout.service';
import { CashbackFileUploadDialogComponent } from './cashback-file-upload-dialog/cashback-file-upload-dialog.component';
import { BulkHistoryService, SearchHistory } from 'src/app/Services/bulk-history.service';

@Component({
  selector: 'app-cashback-bulk-upload',
  templateUrl: './cashback-bulk-upload.component.html',
  styleUrls: ['./cashback-bulk-upload.component.scss']
})
export class CashbackBulkUploadComponent {
  dataSourceCashback: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  myData: SearchHistory[];
  file: File;
  showData: boolean = true; // Initialize to false   

  constructor(private refSer: RefundPayoutService, private toast: ToastrService, private cashbackbulkhistory: BulkHistoryService,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.Columns = this.cashbackbulkhistory.historyColumns;

    this.cashbackbulkhistory.bulkHistroy().subscribe(res => {
      if (res && res.success) {
        var arr: SearchHistory[] = res.data;
        arr.forEach((obj: any) => {

          obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
        });

        this.dataSourceCashback = new MatTableDataSource(res.data);
        this.atLeastOneRequired = true;
        this.showData = true;
      }
    });
  }

  upload() {
    this.refSer.CashBackuploadFileAndData(this.file).subscribe(
      res => {
        if (res && res.success) {
          const dialogRef = this.dialog.open(CashbackFileUploadDialogComponent, {
            width: '60%',
            data: { "fileDetails": res },
            autoFocus: false,
            maxHeight: '400px'
          });
        }
        else
          this.toast.error(res.msg);
      }, err => {

      });
  }

  readFile(event: any) {
    this.file = event.target.files[0];
  }

}
