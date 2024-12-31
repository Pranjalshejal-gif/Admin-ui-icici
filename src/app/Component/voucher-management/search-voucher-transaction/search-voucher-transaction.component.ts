import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ViewReportService } from 'src/app/Services/view-report.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Constants } from 'src/app/Shared/constants';
import { HelperService } from 'src/app/Services/helper.service';
import { VoucherService } from 'src/app/Services/voucher.service';
import { DialogTxnIdComponent } from '../../dashboard/search-transaction/dialog-txn-id/dialog-txn-id.component';

@Component({
  selector: 'app-search-voucher-transaction',
  templateUrl: './search-voucher-transaction.component.html',
  styleUrls: ['./search-voucher-transaction.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: HelperService.MY_FORMATS },]
})

export class SearchVoucherTransactionComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fromDatepicker') fromDatepicker: MatDatepicker<Date>;
  @ViewChild('toDatepicker') toDatepicker: MatDatepicker<Date>;
  selectedFromDate: Date;
  selectedToDate: Date;
  inputFields: any;
  name: string;
  minDateToFinish = new Subject<string>();
  searchForm: FormGroup;
  panelOpen: boolean = true;
  showData: boolean = false;
  myData: any = [];
  txnData: MatTableDataSource<any>;
  expanded = true;
  maxDate: any;
  atLeastOneRequired: boolean = true;
  minDate: Date;
  fileName: string;
  disabled = "false"
  @Input() max: any;
  isDisabled: boolean = false;
  dateFormatHint: string = Constants.DATE_FORMAT_HINT;
  Columns: string[];

  constructor(private fb: FormBuilder,
    private viewRepService: ViewReportService,
    private voucherService: VoucherService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private helper: HelperService) {
    this.Columns = voucherService.searchVoucherTransaction
    const currentDate = new Date();
    this.maxDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    this.searchForm = this.fb.group({
      voucherCode: ['', Validators.required],
      fromDate: [],
      toDate: []
    });
  }

  dateFilter = (date: Date): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight for comparison
    return date <= currentDate;
  };

  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }

  ngOnInit(): void {
    this.fileName = 'transaction-data' + ' ' + this.datePipe?.transform(new Date(), 'dd-MM-yyyy')
  }

  search() {
    let valid = this.searchForm

    let dateCheck = (this.helper.isNullorUndefined(valid.get('fromDate')?.value) && this.helper.isNullorUndefined(valid.get('toDate')?.value))
      || (!this.helper.isNullorUndefined(valid.get('fromDate')?.value) && !this.helper.isNullorUndefined(valid.get('toDate')?.value))

    if (!dateCheck) {
      this.helper.errorResponse(Constants.REQUIRED_FIELDS_MSG);
      return;
    }

    let checkValidData = (this.helper.isNullorUndefined(valid.get('fromDate')?.value) ||
      this.helper.isNullorUndefined(valid.get('toDate')?.value)) &&
      this.helper.isNullorUndefined(valid.get('voucherCode')?.value)

    if (this.searchForm.invalid) {
      this.helper.errorResponse(Constants.REQUIRED_FIELDS_MSG);
      this.showData = false;
      return;
    } else if (checkValidData) {
      this.atLeastOneRequired = false;
      this.showData = false;
      this.helper.errorResponse(Constants.AT_LIST_ONE_SEARCH_CRITERIA_MSG);
    }
    else {
      var obj = this.buildSearchFilter(this.searchForm);
      this.voucherService.searchTransaction(obj).subscribe(request => {
        if (request && request.success && typeof (request.data) == "object") {
          this.myData = request.data;
          this.txnData = new MatTableDataSource(this.myData);
          this.showData = true;
          this.panelOpen = false;
        }
        else {
          this.showData = false;
          this.helper.errorResponse(request.message);
        }
      })
    }
  }

  buildSearchFilter(form: FormGroup) {
    let obj: any = new Object();

    Object.keys(form.controls).forEach(key => {
      if (!this.helper.isNullorUndefined(form.get(key)?.value)) {
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

  openDialog(evt: any) {
    this.dialog.open(DialogTxnIdComponent, {
      width: '60%',
      maxHeight: '500px',
      data: { "tranctionDetails": evt, "componentName": 'searchTxn' },
      autoFocus: false
    });
  }


  reset() {
    for (let value in this.searchForm.controls) {
      this.searchForm.controls[value].setValue('');
      this.searchForm.controls[value].setErrors(null);
    }
    this.showData = false;
  }

  setDate(fromDate: Date, toDate: Date, obj: any) {
    if (this.helper.isNullorUndefined(toDate)) {
      obj['toDate'] = fromDate;
    }
    else if (this.helper.isNullorUndefined(fromDate)) {
      obj['fromDate'] = toDate;
    }
  }

  downloadAsPDF() {

    let prepare: any[] = [];
    let exportColumns: any[] = [];
    let tempObject: any = [];
    this.Columns.forEach((element: any) => {
      exportColumns.push(element.label);
    });

    this.myData.forEach((element: any) => {
      tempObject = [];
      this.Columns.forEach((col: any) => {
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

  downloadAsCSV() {
    let columnNames: string[] = [];
    this.Columns.forEach((element: any) => {
      columnNames.push(element.label);
    });
    let data: any[] = [];
    this.myData.forEach((item: any) => {
      let row: any[] = [];
      this.Columns.forEach((col: any) => {
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
    new ngxCsv(data, this.fileName, options);
  }

  exportAsXLSX(): void {
    let data: any[] = [];
    this.myData.forEach((item: any) => {
      let row: any[] = [];
      this.Columns.forEach((col: any) => {
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
    this.viewRepService.exportAsExcelFile(data, this.fileName, this.Columns);
  }
}