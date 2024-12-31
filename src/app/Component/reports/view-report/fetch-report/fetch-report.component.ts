import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultColumn } from 'src/app/models/result-column';
import { ReportAdminService } from 'src/app/Services/report-admin.service';
import { ViewReportService } from 'src/app/Services/view-report.service';
import {
  Document, Packer, Paragraph, TextRun, Table, WidthType,
  TableRow,
  TableCell,
  PageOrientation,
  HeightRule,
  HeadingLevel,
  AlignmentType
} from "docx";
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ngxCsv, Options } from 'ngx-csv/ngx-csv';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import config from '../../../../../assets/config.json';
import { ToastrService } from 'ngx-toastr';
import { DateRange } from '@angular/material/datepicker';
import { ThisReceiver } from '@angular/compiler';
import { scheduledReportService } from 'src/app/Services/scheduled-reports.service';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: config.dateFormatForReports, // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-fetch-report',
  templateUrl: './fetch-report.component.html',
  styleUrls: ['./fetch-report.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class FetchReportComponent implements OnInit {
  name: string;
  inputFields: any;
  reportEdit: any;
  teller: any = {};
  fetchReportList: any = [];
  fetchReportDataColumns: any[] = [];
  fetchData: any;
  dataSource: MatTableDataSource<any>;
  fetchReportdataSource: MatTableDataSource<any>;
  showResult = false;
  showResultDownload = false;
  displayTable = false;
  query: string;
  today = new Date();
  fileName: string;
  fileNameHeader: string;
  reportInputFields: any = {};
  reportId: any;
  category: any = {};

  constructor(private activatedRoute: ActivatedRoute, private viewRepService: ViewReportService, private toast: ToastrService,
    private reportAdminService: ReportAdminService, private reportSchedulerService: scheduledReportService, private location: Location, public datepipe: DatePipe,
    private router: Router) {
    this.category = this.router.getCurrentNavigation()?.extras;

    this.activatedRoute.params.subscribe(p => {
      this.name = p && p["id"];

    })
  }

  ngOnInit(): void {

    this.viewRepService.fetchReportByName(this.name).subscribe(res => {
      if (res && res.schema) {
        if (res.schema &&
          res.schema.inputFields &&
          res.schema.inputFields.length > 0 &&
          res.schema.inputFields[0].name.toLowerCase().includes('to')) {
          res.schema.inputFields.reverse();
        };
        this.inputFields = res.schema.inputFields;
        this.query = res.schema.query;
        this.reportId = res.schema.id;
      }
    })
    if (this.name == "BalanceSummaryReport " || this.name == "token_wise_details -Date Wise") {
      this.today.setDate(this.today.getDate() - 1);
    } else {
      this.today = new Date();
    }
  }

  fetchReportDownload() {
    //added custom code for date field handling need to review this
    let obj: any = new Object();

    Object.keys(this.teller).forEach(key => {
      if (key.endsWith('Date') || key.endsWith('date'))
        obj[key] = this.datepipe.transform(this.teller[key], 'dd/MMM/yyyy');
      else
        obj[key] = this.teller[key];
    });

    let formInputCount = Object.keys(this.teller).length;
    let reportInputCount = Object.keys(this.inputFields).length;

    if (reportInputCount !== formInputCount) {
      this.toast.error('Please select input field(s)');
      return;
    }

    this.reportInputFields = obj;
    this.showResultDownload = false;
    this.showResult = false;

    let request = {
      reportName: this.name,
      reportId: this.reportId,
      reportCategory: this.category.title,
      reportCategoryId: this.category.id,
      inputParams: this.reportInputFields
    }

    this.reportSchedulerService.scheduleReport(request).subscribe(res => {
      if (res && !res.success) {
        this.toast.error(res && res.message);
      }
    });
  }

  fetchSampleReport() {
    //added custom code for date field handling need to review this
    let obj: any = new Object();
    let count = 0;

    Object.keys(this.teller).forEach(key => {
      if (key.endsWith('Date') || key.endsWith('date'))
        obj[key] = this.datepipe.transform(this.teller[key], 'dd/MMM/yyyy');
      else
        obj[key] = this.teller[key];
    });

    let formInputCount = Object.keys(this.teller).length;
    let reportInputCount = Object.keys(this.inputFields).length;

    if (reportInputCount !== formInputCount) {
      this.toast.error('Please select input field(s)');
      return;
    }

    let req = {
      inputFields: this.inputFields,
      inputParams: obj,
      query: this.query,
      reportName: this.name
    }


    this.reportAdminService.fetchReport(req).subscribe(
      data => {
        this.fetchReportList = data['columns'];
        this.fetchReportList.sort((a: any, b: any) => a.columnOrder - b.columnOrder)
        this.fetchData = data['data'];
        this.displayColumnsByColumnOrder();
        this.dataSource = new MatTableDataSource(this.fetchData);
        this.showResult = true;
        this.showResultDownload = false;

      },
    );
  }

  isNullorUndefined(val: any) {
    if (val == undefined)
      return true;
    if (val == '')
      return true;
    if (val == null)
      return true;
    return false;
  }

  exportAsXLSX(): void {

    this.reportAdminService.fetchReportDownload(this.name, 'Excel', this.reportInputFields);
  }

  downloadAsPDF() {
    this.reportAdminService.fetchReportDownload(this.name, 'PDF', this.reportInputFields);
  }

  downloadAsDOC() {
    this.reportAdminService.fetchReportDownload(this.name, 'DOC', this.reportInputFields);
  }

  downloadAsCSV() {
    this.reportAdminService.fetchReportDownload(this.name, 'CSV', this.reportInputFields);
  }

  displayColumnsByColumnOrder() {
    this.fetchReportDataColumns = [];
    this.fetchReportList.forEach((column: any) => {
      this.fetchReportDataColumns.push({ name: column.title, label: column.title });
    })
  }

  back() {
    this.location.back();
  }
}
