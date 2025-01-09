import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/Services/dashboard.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subject, from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogTxnIdComponent } from './dialog-txn-id/dialog-txn-id.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ViewReportService } from 'src/app/Services/view-report.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import config from '../../../../assets/config.json';
import { MonitorService } from 'src/app/Services/monitor.service';
import { ConfigData } from 'src/app/models/config_data';
import { SharedService } from 'src/app/Services/shared.service';


const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: config.dateFormatForTxn, // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-search-transaction',
  templateUrl: './search-transaction.component.html',
  styleUrls: ['./search-transaction.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class SearchTransactionComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  searchForm: FormGroup;
  panelOpen: boolean = true;
  showData: boolean = false;
  myData: any = [];
  txnData: MatTableDataSource<any>;
  expanded = true;
  minDateToFinish = new Subject<string>();
  atLeastOneRequired: boolean = true;
  minDate: Date;
  today = new Date();
  fileName: string;
  isDisabled: boolean = false;
  configData: ConfigData = config;

  columns: any[] = [
    { name: 'refId', label: 'transactionID' },
    { name: 'rrn', label: 'RRN' },
    { name: 'type', label: 'Type' },  
     { name: 'paymentRefId', label: 'PaymentRefId' },
     { name: 'paymentMode', label: 'Payment Mode' },
    { name: 'amount', label: 'Amount' },
     { name: 'createDate', label: 'Created Date' },
    { name: 'rc', label: 'RC' },
    { name: 'status', label: 'Status' },
    { name: 'displayMessage', label: 'Display Message' },

  ];


  columnsToExport = [
    'refId','rrn','type','paymentRefId','status','paymentMode','amount','rc','createDate','billerId','displayMessage','billerTxn','blrRespBillDate','blrRespDueDate','billerMode','initiatorMobile','initiatorEmail','initiatorAadhaar','initiatorPan'
  ]
    dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }

  constructor(private toast: ToastrService, private fb: FormBuilder, private viewRepService: ViewReportService,
    private dashboardSer: DashboardService, public dialog: MatDialog, private datePipe: DatePipe, private toastr: ToastrService, private sharedSer: SharedService) {
    this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      txnId: [''],
      rrn: [''],
      amount: [''],
      paymentRefId:[''],
      type:[''],
      paymentMode:[''],
      rc:[''],
      createDate:[''],
     


      






      // payerVPA: ['', [Validators.pattern]],
      // payeeVPA: ['', [Validators.pattern]],
      // payerMobile: ['', [Validators.pattern]],
      // payeeMobile: ['', [Validators.pattern]],
      // payerName: ['', [Validators.pattern]],
      // payeeName: ['', [Validators.pattern]],
      // payerWallet: [''],
      // payeeWallet: [''],
      transactionStatus: [''],
      searchType: [''],
      searchValue: ['']
    });
    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
  }

  ngOnInit(): void {
    this.fileName = 'transaction-data' + ' ' + this.datePipe?.transform(new Date(), 'dd-MM-yyyy')
  }

  dropdownOptions: string[] = ['VPA', 'WALLET', 'MOBILE', 'NAME']; // Add your dropdown options here
  showInput: boolean = false;
  inputValue: string = '';
  onDropdownSelectionChange(event: any) {
    this.showInput = true;
    this.inputValue = ''; // Reset the input value when a new option is selected
  }
  search() {
    let valid = this.searchForm
    let checkValidData = isNullorUndefined(valid.get('fromDate')?.value) &&
      isNullorUndefined(valid.get('toDate')?.value) &&
      isNullorUndefined(valid.get('txnId')?.value) &&
      isNullorUndefined(valid.get('amount')?.value) &&
      isNullorUndefined(valid.get('rrn')?.value) &&
      isNullorUndefined(valid.get('paymentRefId')?.value) &&
      isNullorUndefined(valid.get('transactionStatus')?.value) &&

      
     






      // isNullorUndefined(valid.get('payerVPA')?.value) &&
      // isNullorUndefined(valid.get('payeeVPA')?.value) &&
      // isNullorUndefined(valid.get('payerWallet')?.value) &&
      // isNullorUndefined(valid.get('payeeWallet')?.value) &&
      // isNullorUndefined(valid.get('payerMobile')?.value) &&
      // isNullorUndefined(valid.get('payeeMobile')?.value) &&
      // isNullorUndefined(valid.get('payerName')?.value) &&
      // isNullorUndefined(valid.get('payeeName')?.value) &&

      // isNullorUndefined(valid.get('mobile')?.value) &&
      // isNullorUndefined(valid.get('walletAddress')?.value) &&
      // isNullorUndefined(valid.get('vpa')?.value) &&
      isNullorUndefined(valid.get('searchType')?.value) &&
      isNullorUndefined(valid.get('searchValue')?.value)

    if (this.searchForm.invalid) {
      this.toast.error("Please Enter Valid Inputs");
      this.showData = false;
      return;
    } else if (checkValidData) {
      this.atLeastOneRequired = false;
      this.showData = false;
      this.toastr.error("At least one search criteria is required");
    }
    else {
      const difference = Math.abs(this.searchForm.value.toDate - this.searchForm.value.fromDate);
      const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));
      const allowedDateRange = this.configData.dayDiffForSearchCriteria
      if (daysDifference >= allowedDateRange) {
        this.sharedSer.raiseDayDiffMessage();
        return;
      }
      var obj = this.buildSearchFilter(this.searchForm);
      this.dashboardSer.getTransactions(obj).subscribe(r => {
        if (r && r.success && typeof (r.data) == "object") {
          this.myData = r.data;
          this.dashboardSer.updateData('upiClientTxnDetails');
          this.txnData = new MatTableDataSource(this.myData);
          this.showData = true;
          this.panelOpen = false;
          (this.myData as any[]).forEach(r => {
            if (r.itc === 'APP.ReqPay.PAY' && r.flow === 'UPI_PAYMENT_SUPPORT') {
              r.type = 'UPI_PAY';
            } else if (r.itc === 'Big.UpiRefund' && r.flow === 'REFUND') {
              r.type = 'UPI_REFUND';
            }
          });
            console.log("my data  "+ JSON.stringify(this.myData));
        }
        else {
          this.showData = false;
          this.toastr.error(r.data);
        }
      })
    }
  }

  reset() {
    for (let value in this.searchForm.controls) {
      this.searchForm.controls[value].setValue('');
      this.searchForm.controls[value].setErrors(null);
    }
    this.showData = false;
  }

  buildSearchFilter(form: FormGroup) {
    let obj: any = new Object();

    Object.keys(form.controls).forEach(key => {
      if (!isNullorUndefined(form.get(key)?.value)) {
        if (key == 'fromDate' || key == 'toDate') {
          obj[key] = this.datePipe.transform(form.get(key)?.value, 'dd-MM-yyyy');
          this.setDate(obj['fromDate'], obj['toDate'], obj);
        }
        else
          obj[key] = form.get(key)?.value;
      }

    });


    return obj;
  }

  setDate(fromDate: Date, toDate: Date, obj: any) {
    if (isNullorUndefined(toDate)) {
      obj['toDate'] = fromDate;
    }
    else if (isNullorUndefined(fromDate)) {
      obj['fromDate'] = toDate;
    }
  }

  downloadAsPDF() {
    let prepare: any[] = [];
    let exportColumns: any[] = [];
    let tempObject: any = [];
    this.columns.forEach((element: any) => {
      exportColumns.push(element.label);
    });
    this.myData.forEach((element: any) => {
      tempObject = [];
      this.columns.forEach((col: any) => {
        if (col.name.toLowerCase().includes('date')) {
          tempObject.push(element[col.name] && new Date(element[col]).toString() != 'Invalid Date' ? this.datePipe?.transform(new Date(element[col]), 'MMM d, y, HH:mm:ss') : '');
        } else {
          tempObject.push(element[col.name])
        }
      })
      prepare.push(tempObject);
    });
    const doc = new jsPDF({ orientation: 'landscape', format: [200, exportColumns.length * 40] })
    autoTable(doc,
      {
        styles: { cellWidth: 'wrap', cellPadding: 0, fontSize: 10, textColor: 'black', halign: 'center' },
        body: [[this.fileName]]
      }
    );
    autoTable(doc,
      {
        head: [exportColumns],
        body: prepare,
        startY: 18,
        styles: { overflow: 'linebreak', cellWidth: 'wrap', cellPadding: 1, fontSize: 6 },
        columnStyles: {
          someColumnName1: { cellWidth: 10 },
          someColumnName2: { cellWidth: 10 }
        }
      }
    )
    doc.save(this.fileName + '.pdf');
  }

  openDialog(evt: any) {
    const dialogRef = this.dialog.open(DialogTxnIdComponent, {
      width: '60%',
      maxHeight: '52500px',
      data: { "tranctionDetails": evt },
      autoFocus: false
    });
  }

  downloadAsCSV() {
    let columnNames: string[] = [];
    this.columns.forEach((element: any) => {
      columnNames.push(element.label);
    });
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
        row.push(val == undefined ? '' : val);
      });
      data.push(row);
    });
    var options = {
      title: this.fileName,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      noDownload: false,
      showTitle: true,
      useBom: true,
      headers: columnNames
    };

    const fileInfo = new ngxCsv(data, this.fileName, options);
  }

  exportAsXLSX(): void {


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
    this.viewRepService.exportAsExcelFile(data, this.fileName, this.columns);
  }
}

function isNullorUndefined(val: any) {
  if (val == undefined)
    return true;
  if (val == '')
    return true;
  if (val == null)
    return true;
  return false;
}
function typeOf(data: any) {
  throw new Error('Function not implemented.');
}


