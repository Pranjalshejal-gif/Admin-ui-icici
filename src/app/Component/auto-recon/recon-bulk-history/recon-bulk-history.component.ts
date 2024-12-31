import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AutoReconService } from 'src/app/Services/auto-recon.service'
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-recon-bulk-history',
  templateUrl: './recon-bulk-history.component.html',
  styleUrls: ['./recon-bulk-history.component.scss']
})
export class ReconBulkHistoryComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);

  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showData: boolean;
  myData: any = [];
  searchAllTxntypeForm: FormGroup;
  requestPayload: any;
  txnData: MatTableDataSource<any>;
  uploadData: boolean;

  reconBulkhistoryColumns: any[] = [
    { name: 'uploadName', label: 'File Name' },
    { name: 'status', label: 'Status' },
    { name: 'created', label: 'Created Date' },
    { name: 'totalRecords', label: 'Total Records' },
    { name: 'successfulCount', label: 'Success Record' },
    { name: 'errorRecord', label: 'Error Record' },
    { name: 'description', label: 'Description' },
    { name: 'downloadbulk', label: 'Action' },

  ];

  constructor(private _formBuilder: FormBuilder, private autoRecon: AutoReconService,
    private router: Router, public dialog: MatDialog, private datePipe: DatePipe, private helper: HelperService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.searchAllTxntypeForm = this._formBuilder.group({
      txnType: ['', Validators.required],
      subTxnType: ['', Validators.required]
    });
    this.searchAllTxntypeForm.get('txnType')?.valueChanges.subscribe(value => {
      // Reset the value of 'subTxnType' when 'txnType' changes
      this.searchAllTxntypeForm.get('subTxnType')?.setValue('', { emitEvent: false });
      // Reset the validity of 'subTxnType' to trigger validation
      this.searchAllTxntypeForm.get('subTxnType')?.updateValueAndValidity({ emitEvent: false });
      this.requestPayload = {};
    });

  }

  search() {
    if (this.searchAllTxntypeForm.invalid) {
      return;
    }
    let validtxn = this.searchAllTxntypeForm;
    let txnType = validtxn.get('txnType')?.value;
    let subTxnType = validtxn.get('subTxnType')?.value;

    if (!this.helper.isNullorUndefined(txnType)) {
      this.requestPayload = { "fileType": this.autoRecon.recon_File_Type, "fileSubType": "" };

      if (txnType === "LOAD-UPI") {
        if (subTxnType === "UPI-PAY") {
          this.reconBulkhistoryColumns = this.reconBulkhistoryColumns;
          this.requestPayload.fileSubType = "LOAD-UPI-PAY"
        } else if (subTxnType === "UPI-REV") {

          this.reconBulkhistoryColumns = this.reconBulkhistoryColumns;
          this.requestPayload.fileSubType = "LOAD-UPI-REV"

        }
      } else if (txnType === "LOAD-CBS") {
        if (subTxnType === "CBS-PAY") {
          this.reconBulkhistoryColumns = this.reconBulkhistoryColumns;
          this.requestPayload.fileSubType = "LOAD-CBS-PAY"

        } else if (subTxnType === "CBS-REV") {
          this.reconBulkhistoryColumns = this.reconBulkhistoryColumns;
          this.requestPayload.fileSubType = "LOAD-CBS-REV"

        }
      }

      this.autoRecon.bulkHistroy(this.requestPayload.fileSubType).subscribe(r => {
        if (r && r.success) {
          r.data.forEach((obj: any) => {

            obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
          });
          this.dataSource = r.data;
          this.txnData = new MatTableDataSource(this.dataSource);
          this.showData = true;
          this.uploadData = true;
        } else {
          this.showData = false;
          this.uploadData = false;
          this.toast.error(r.message);
        }
      });
    }



  }

}
