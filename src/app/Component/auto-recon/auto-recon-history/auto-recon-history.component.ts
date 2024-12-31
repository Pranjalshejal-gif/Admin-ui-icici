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
  selector: 'app-auto-recon-history',
  templateUrl: './auto-recon-history.component.html',
  styleUrls: ['./auto-recon-history.component.scss']
})
export class AutoReconHistoryComponent implements OnInit {

  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showData: boolean;
  myData: any = [];
  fileName: string;
  searchAllTxntypeForm: FormGroup;
  txnData: MatTableDataSource<any>;
  uploadData: boolean;
  columns: any[];
  requestPayload: any;

  columnsUPI: any[] = [
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
    { name: 'switchAction', label: 'Switch Action' },
    { name: 'upiRetryCount', label: 'Upi Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  columnsUPIRev: any[] = [
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
    { name: 'switchAction', label: 'Switch Action' },
    { name: 'rrn', label: 'RRN' },
    { name: 'reversalRrn', label: 'Reversal RRN' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];


  columnsCBS: any[] = [

    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'switchAction', label: 'Switch Action' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }

  ];

  columnsCBSRev: any[] = [
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: ' Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'cbsReversal', label: 'CBS Reversal' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'makerCheckerStatus', label: 'Maker Checker Status' },
    { name: 'switchAction', label: 'Switch Action' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  constructor(private _formBuilder: FormBuilder, private router: Router,
    private toast: ToastrService, private helper: HelperService, private autoRecon: AutoReconService, private datePipe: DatePipe) {
  }

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


      this.autoRecon.autoReconHistory(this.requestPayload).subscribe(r => {
        this.myData = r.data;
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





