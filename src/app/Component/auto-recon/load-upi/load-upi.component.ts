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
  selector: 'app-load-upi',
  templateUrl: './load-upi.component.html',
  styleUrls: ['./load-upi.component.scss']
})
export class LoadUPIComponent implements OnInit {

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

  constructor(private _formBuilder: FormBuilder, private autoRecon: AutoReconService,
    private router: Router, public dialog: MatDialog, private datePipe: DatePipe, private helper: HelperService,
    private toast: ToastrService) {

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
  getTooltipText() {
    let tooltipText = `Search a type of transaction which are in pending status for inputs would be require from bank user.
    Such as UPI -load or CBS load`;

    const txnType = this.searchAllTxntypeForm.get('txnType')?.value;
    const subTxnType = this.searchAllTxntypeForm.get('subTxnType')?.value;
    if (!txnType) {
      return tooltipText; // Return default text if no txnType is selected
    }
    if (txnType === "LOAD-UPI") {
      if (subTxnType === "UPI-PAY") {
        tooltipText = 'Quickly check the UPI Debit pending transactions. Bank user can download the file and provide the status of UPI transactions. Value to be passed in UPI Manual Action.SUCCESS- It indicates that the UPI transaction successful. The bank needs to initiate the reversal against the transaction in UPI manually. Please ensure to mention RESOLVED status in reverse file upload.FAILED - It indicates that the UPI transaction failed.No further action is required.Please ensure to mention RESOLVED status in reverse file upload.';
      } else if (subTxnType === "UPI-REV") {
        tooltipText = `Quickly check the UPI Reversal pending transactions.
        Bank user can download the file and provide the status of UPI Reversal transactions.Value to be passed in UPI Manual Action.
        SUCCESS- It indicates that the UPI  Reversal transaction successful. No further action is required. Please ensure to mention RESOLVED status in reverse file upload.
         FAILED - It indicates that the UPI Reversal transaction failed.The bank needs to initiate the reversal against the transaction in UPI manually.Please ensure to mention RESOLVED status in reverse file upload.`;
      } else {
        tooltipText = "Gives you to ability to check the UPI load or UPI reversal pending transactions.";
      }
    } else if (txnType === "LOAD-CBS") {
      if (subTxnType === "CBS-PAY") {
        tooltipText = " - Information about CBS Payment";
      } else if (subTxnType === "CBS-REV") {
        tooltipText = " - Information about CBS Reversal";
      } else {
        tooltipText = "Load-CBS meassage";
      }
    }
    return tooltipText;
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
          this.columns = this.autoRecon.columnsUPI;
          this.requestPayload.fileSubType = "LOAD-UPI-PAY"
        } else if (subTxnType === "UPI-REV") {

          this.columns = this.autoRecon.columnsUPIRev;
          this.requestPayload.fileSubType = "LOAD-UPI-REV"

        }
      } else if (txnType === "LOAD-CBS") {
        if (subTxnType === "CBS-PAY") {
          this.columns = this.autoRecon.columnsCBS;
          this.requestPayload.fileSubType = "LOAD-CBS-PAY"

        } else if (subTxnType === "CBS-REV") {
          this.columns = this.autoRecon.columnsCBSRev;
          this.requestPayload.fileSubType = "LOAD-CBS-REV"
        }
      }

      this.fileName = this.requestPayload.fileSubType;

      this.autoRecon.search(this.requestPayload).subscribe(r => {
        this.myData = r.data;
        if (r && r.success) {
          this.dataSource = r.data;
          var arr = r.data;
          arr.forEach((obj: any) => {
            obj.makerCheckerStatus = obj.makerCheckerStatus === "P" ? 'PENDING' :
              obj.makerCheckerStatus === "C" ? 'COMPLETED' :
                obj.makerCheckerStatus === "R" ? 'REJECTED' :
                  obj.makerCheckerStatus === "I" ? 'IN PROGRESS' :
                    obj.makerCheckerStatus === "A" ? 'APPROVED' :
                      obj.makerCheckerStatus === null ? 'NEW' :
                        '';
          });
          this.txnData = new MatTableDataSource(r.data);
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



  bulkUpload() {
    this.router.navigate(['load-upi/bulk-upload']);
  }

  autoReconexportAsXLSX(): void {

    let data: any[] = [];
    this.myData.forEach((item: any) => {
      let row: any[] = [];
      this.columns.forEach((col: any) => {
        let val;
        if (col.name.toLowerCase().includes('date')) {
          val = item[col.name] && new Date(item[col.name]).toString() != 'Invalid Date' ? this.datePipe?.transform(new Date(item[col.name]), 'MMM d, y, HH:mm:ss') : ''
        } else {
          val = item[col.name];
        }
        row[col.label] = val == undefined ? '' : val;
      });
      data.push(row);
    });

    this.autoRecon.exportAsExcelFile(data, this.fileName, this.columns);
  }

}


