import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoReconService } from 'src/app/Services/auto-recon.service';
import { HelperService } from 'src/app/Services/helper.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-app-rej-autorecon',
  templateUrl: './app-rej-autorecon.component.html',
  styleUrls: ['./app-rej-autorecon.component.scss']
})
export class AppRejAutoreconComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  dataSource: any = [];
  showData: boolean;
  customer: any = {};
  Columns: string[];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTxntypeForm: FormGroup;
  indexArray: string[] = [];
  load: any;
  txnData: MatTableDataSource<any>;
  data: any;
  txnColumns: string[];
  spanContent: string;
  //Approve and Reject table columns
  columns: any[];
  requestPayload: any;

  columnsUPI: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'upi', label: 'UPI' },
    { name: 'upiRefId', label: 'UPI Ref Id' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'upiRetryCount', label: 'Upi Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  columnsUPIRev: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'upi', label: 'UPI' },
    { name: 'upiRefId', label: 'UPI Ref Id' },
    { name: 'upiReversal', label: 'UPI Reversal' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'upiRetryCount', label: 'Upi Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'reversalRrn', label: 'Reversal RRN' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];


  columnsCBS: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  columnsCBSRev: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'cbsReversal', label: 'CBS Reversal' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  constructor(private fb: FormBuilder, private router: Router,
    private toast: ToastrService, private helper: HelperService, private autoRecon: AutoReconService, public dialog: MatDialog, private datePipe: DatePipe,) {

    this.searchTxntypeForm = this.fb.group({
      txnType: ['', Validators.required],
      subTxnType: ['', Validators.required]

    });
    this.searchTxntypeForm.get('txnType')?.valueChanges.subscribe(value => {
      // Reset the value of 'subTxnType' when 'txnType' changes
      this.searchTxntypeForm.get('subTxnType')?.setValue('', { emitEvent: false });
      // Reset the validity of 'subTxnType' to trigger validation
      this.searchTxntypeForm.get('subTxnType')?.updateValueAndValidity({ emitEvent: false });
      this.requestPayload = {};
    });

  }
  ngOnInit(): void {

  }

  search() {
    if (this.searchTxntypeForm.invalid) {
      return;
    }
    let validtxn = this.searchTxntypeForm;
    let txnType = validtxn.get('txnType')?.value;
    let subTxnType = validtxn.get('subTxnType')?.value;

    if (!this.helper.isNullorUndefined(txnType)) {
      this.requestPayload = { "txnType": "LOAD", "fileSubType": "" };

      if (txnType === "LOAD-UPI") {
        if (subTxnType === "UPI-PAY") {
          this.columns = this.columnsUPI;
          this.requestPayload.fileSubType = "LOAD-UPI-PAY"

        } else if (subTxnType === "UPI-REV") {
          this.columns = this.columnsUPIRev;
          this.requestPayload.fileSubType = "LOAD-UPI-REV"
        }
      } else if (txnType === "LOAD-CBS") {
        if (subTxnType === "CBS-PAY") {
          this.columns = this.columnsCBS;
          this.requestPayload.fileSubType = "LOAD-CBS-PAY"
        } else if (subTxnType === "CBS-REV") {
          this.columns = this.columnsCBSRev;
          this.requestPayload.fileSubType = "LOAD-CBS-REV"
        }
      }

      this.autoRecon.getByStatus(this.requestPayload).subscribe(r => {
        if (r && r.success) {
          this.dataSource = r.data;
          this.txnData = new MatTableDataSource(this.dataSource);
          this.showData = true;

        } else {
          this.showData = false;
          this.toast.error(r.message);
        }
      });
    }
  }

}













