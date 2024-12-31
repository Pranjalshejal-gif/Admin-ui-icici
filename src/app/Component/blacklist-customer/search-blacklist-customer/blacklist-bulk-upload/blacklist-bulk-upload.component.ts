import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { BlacklistFileUploadDialogComponent } from './blacklist-file-upload-dialog/blacklist-file-upload-dialog.component';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';

@Component({
  selector: 'app-blacklist-bulk-upload',
  templateUrl: './blacklist-bulk-upload.component.html',
  styleUrls: ['./blacklist-bulk-upload.component.scss']
})
export class BlacklistBulkUploadComponent {

  file: File;
  showData: boolean;
  fileData: MatTableDataSource<any>;
  timer: any;
  columns: any[] = [
    { name: 'blockType', label: 'Block Type' },
    { name: 'blockValue', label: 'Block Value' },
    { name: 'status', label: 'Status(B/U)' },
    { name: 'txnType', label: 'Txn Type' },
    { name: 'updatedReason', label: 'Updated Reason' },
  ];
  constructor(private dashboardSer: DashboardService, private toast: ToastrService, private blacklistCustSer: BlacklistCustomerService,
    public dialog: MatDialog) { }

  upload() {
    this.blacklistCustSer.uploadFileAndData(this.file, 'blacklist-bulk-upload').subscribe(
      res => {
        if (res && res.success) {
          const dialogRef = this.dialog.open(BlacklistFileUploadDialogComponent, {
            width: '60%',
            data: { "fileDetails": res },
            autoFocus: false,
            maxHeight: '400px'
          });
        }
        else
          this.toast.error(JSON.stringify(res));
      }, err => {
        console.log(err);
      });
  }
  readFile(event: any) {
    this.file = event.target.files[0];
  }
}
