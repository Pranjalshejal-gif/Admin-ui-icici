import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import * as FileSaver from 'file-saver';
import { Subject } from 'rxjs/internal/Subject';
import { ReportCategoryService } from 'src/app/Services/report-category.service';
import { scheduledReportService } from 'src/app/Services/scheduled-reports.service';
import { ViewReportService } from 'src/app/Services/view-report.service';
import { ReportCategory } from 'src/app/models/report-category';
import config from 'src/assets/config.json';
import { ConfigData } from 'src/app/models/config_data';
import { Constants } from 'src/app/Shared/constants';
import { HelperService } from 'src/app/Services/helper.service';

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
  selector: 'app-scheduled-reports',
  templateUrl: './scheduled-reports.component.html',
  styleUrls: ['./scheduled-reports.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class ScheduledReportsComponent implements OnInit {
  reportSearchForm: FormGroup;
  today = new Date();
  minDateToFinish = new Subject<string>();
  minDate: Date;
  showReportsTable: boolean = false;
  reportsColumns: any = this.reportService.reportsDataColumns;
  reportsData: any;
  reportCategories: Array<ReportCategory>;
  reportList: any[] = [];
  selectedCategory: any;
  configData: ConfigData = config;
  dateFormatHint: string = Constants.DATE_FORMAT_HINT;



  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }

  constructor(private fb: FormBuilder, private helper: HelperService, private reportService: scheduledReportService,
    private datePipe: DatePipe, private reportCategoryService: ReportCategoryService, private viewReportService: ViewReportService) {

    this.reportSearchForm = this.fb.group({
      reportCategoryId: [''],
      reportName: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.reportCategoryService.getAll().subscribe(
      res => {
        this.reportCategories = res.data;
        this.reportCategories.sort((a, b) => {
          const titleA = a.title ? a.title : '';
          const titleB = b.title ? b.title : '';
          return titleA.localeCompare(titleB);
        })
      },
    );
  }

  onCategorySelected(obj: any) {
    this.selectedCategory = obj.value;
    if (this.selectedCategory) {
      if (this.reportList.find(r => r.id == obj.value)) {
        return;
      }
      this.viewReportService.getReportsForCategory(obj.value).subscribe(res => {
        if (res && res.success) {
          this.reportList.push({ id: obj.value, report: res.data });
        }
      })
    }

  }

  reportSearch() {
    if (this.reportSearchForm.invalid) {
      this.helper.errorResponse("Please Enter Valid Data");
      return;
    }
    var obj = this.buildSearchFilter(this.reportSearchForm);
    this.reportService.reportSearch(obj).subscribe(res => {
      if (res && res.success) {

        var arr = res.data;
        arr.forEach((obj: any) => {
          obj.status = obj.status === "N" ? 'NEW' : obj.status === "C" ? 'COMPLETED' : obj.status === "I" ? 'IN PROGRESS' : obj.status === "E" ? 'ERROR' : '';
        });
        console.log("arr" + JSON.stringify(arr));

        this.showReportsTable = true;
        this.reportsData = new MatTableDataSource(res.data);
      } else {
        this.showReportsTable = false;
        this.helper.errorResponse(res.message);
      }
    })
  }

  reset() {
    for (let value in this.reportSearchForm.controls) {
      this.reportSearchForm.controls[value].setValue('');
      this.reportSearchForm.controls[value].setErrors(null);
    }
    this.showReportsTable = false;
  }

  scheduleReportDownload(row: any) {
    this.reportService.getScheduledReport(row.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
      }
      else this.helper.errorResponse("Error downloading file!");
    }, err => {
      this.helper.errorResponse("Error downloading file!");
    });
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

  setDate(fromDate: Date, toDate: Date, obj: any) {
    if (this.helper.isNullorUndefined(toDate)) {
      obj['toDate'] = fromDate;
    }
    else if (this.helper.isNullorUndefined(fromDate)) {
      obj['fromDate'] = toDate;
    }
  }

}
