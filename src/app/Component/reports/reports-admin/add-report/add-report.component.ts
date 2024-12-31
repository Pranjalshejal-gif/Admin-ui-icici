import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportInputField } from 'src/app/models/report-input-field';
import { ResultColumn } from 'src/app/models/result-column';
import { ReportAdminService } from 'src/app/Services/report-admin.service';
import { ReportCategoryService } from 'src/app/Services/report-category.service';
import { ReportsService } from 'src/app/Services/report.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import config from '../../../../../assets/config.json';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';

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
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class AddReportComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  secondFormGroup = this._formBuilder.group({
  });
  UserAdmin: any;
  showResult: boolean;
  reportCategory: any;
  reportDB: any;
  targetDb: any;
  dbList: any;
  selectedDB: any;
  checkReport = 'Add';
  inputField: any;
  reportEdit: any;
  teller: any = {};
  selectedCat: any
  fetchReportList: any = [];
  fetchData: any;
  firstFormGroup: FormGroup;
  dataSource: MatTableDataSource<any>;
  fetchReportdataSource: MatTableDataSource<any>;
  fetchReportData: MatTableDataSource<any>;
  isFormValid = false;
  today = new Date();
  isFetchSuccess = false;
  displayedColumns: any[] = [
    { name: 'name', label: 'name' },
    { name: 'type', label: 'type' },
    { name: 'caption', label: 'sql parameter' },
    { name: 'action', label: 'Remove' }
  ];
  fetchReportDisplayedColumns: any[] = [
    { name: 'title', label: 'Result Column Name' },
    { name: 'fieldType', label: 'Type' },
    { name: 'action', label: 'Action' }
  ];
  fetchReportDataColumns: any[] = [
    { name: 'EMAIL', label: 'EMAIL' },
    { name: 'NAME', label: 'NAME' },
    { name: 'AUTH_TYPE', label: 'AUTH TYPE' },
    { name: 'LOGGED_IN', label: 'LOGGED IN' },
    { name: 'CREATEDDATE', label: 'CREATED DATE' },
    { name: 'PASSWD', label: 'PASSWORD' },
    { name: 'ID', label: 'ID' },
    { name: 'INSTITUTE_ID', label: 'INSTITUTE ID' },
    { name: 'LOGINATTEMPTS', label: 'LOGIN ATTEMPTS' },
    { name: 'ACTIVE', label: 'ACTIVE' },
    { name: 'UPDATEDDATE', label: 'UPDATED DATE' },
    { name: 'LAST_ACTIVITY', label: 'LAST ACTIVITY' },
    { name: 'DELETED', label: 'DELETED' },
    { name: 'VERIFIED', label: 'VERIFIED' },
    { name: 'NICK', label: 'NICK' },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private router: Router,
    private reportCategoryService: ReportCategoryService,
    private reportAdminService: ReportAdminService,
    private datePipe: DatePipe,
    private toast: ToastrService,
  ) {
    this.UserAdmin = this.router.getCurrentNavigation()?.extras;
    if (this.UserAdmin && this.UserAdmin.id) {
      this.checkReport = 'Edit';
    }
  }

  formInitialization() {
    this.firstFormGroup = this._formBuilder.group({
      selectedReport: ['', Validators.required],
      targetDb: [''],
      name: ['', Validators.required],
      title: ['', Validators.required],
      query: ['', Validators.required],
      subTitleTemplate: ['', Validators.required],
      fileNameQuery: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.showResult = true;
    this.formInitialization()
    if (this.checkReport == 'Edit') {
      this.firstFormGroup = this._formBuilder.group({
        id: this.UserAdmin?.id,
        name: this.UserAdmin?.name,
        title: this.UserAdmin?.title,
        query: this.UserAdmin?.query,
        subTitleTemplate: this.UserAdmin?.subTitleTemplate,
        fileNameQuery: this.UserAdmin?.fileNameQuery,
        targetDb: this.UserAdmin?.targetDb,
        selectedReport: ''
      });

    }
    this.getReportCategory();
    this.getReportDatabase();
  }

  async getReportCategory() {
    await this.reportCategoryService.getAll().subscribe(
      res => {
        this.reportCategory = res.data;
        if (this.checkReport == 'Edit') {
          this.getReportId()
        }
      },
    );
  }

  async getReportDatabase() {
    this.reportCategoryService.getAllReportDB().subscribe(
      res => {
        this.reportDB = res.data;
      },
    );
  }

  async getReportIdDB() {
    await this.reportAdminService.getReportIdDB(this.UserAdmin.id).subscribe(
      data => {
        this.selectedDB = data.data.id;
      },
    );
  }

  async getReportId() {
    await this.reportAdminService.getReportId(this.UserAdmin.id).subscribe(
      res => {
        this.selectedCat = res.data.id
      },
    );
  }

  onSave() {
    this.inputField = [];
    if (this.firstFormGroup.invalid) {
      return;
    }
    this.fetchReportList = [];
    this.isFetchSuccess = false;

    if (this.checkReport == 'Add') {
      let request = {
        "name": this.firstFormGroup.value.name,
        "title": this.firstFormGroup.value.title,
        "query": this.firstFormGroup.value.query,
        "subTitleTemplate": this.firstFormGroup.value.subTitleTemplate,
        "suppressColumnCaptions": this.UserAdmin.suppressColumnCaptions,
        "fileNameQuery": this.firstFormGroup.value.fileNameQuery,
        "targetDb": this.firstFormGroup.value.targetDb,
        "inputFields": [],
        "resultColumns": []
      };


      this.reportAdminService.inputField(request).subscribe(
        data => {
          this.isFormValid = true;
          this.stepper.next();
          this.inputField = data['input-fields'];
          const idx = this.inputField.findIndex((x: any) => { return x?.name?.toUpperCase() === "FROMDATE" })
          if (idx > 0) {

            this.inputField.reverse();
          }

          this.dataSource = new MatTableDataSource(this.inputField as ReportInputField[]);
        }
      );
    }
    else {
      let request = {
        "id": this.firstFormGroup.value.id,
        "name": this.firstFormGroup.value.name,
        "title": this.firstFormGroup.value.title,
        "query": this.firstFormGroup.value.query,
        "subTitleTemplate": this.firstFormGroup.value.subTitleTemplate,
        "fileNameQuery": this.firstFormGroup.value.fileNameQuery,
        "suppressColumnCaptions": this.UserAdmin.suppressColumnCaptions,
        "targetDb": this.firstFormGroup.value.targetDb,
        "inputFields": [],
        "resultColumns": []
      };

      this.reportAdminService.inputField(request).subscribe(
        data => {
          this.stepper.next();
          this.inputField = data['input-fields'];
          const idx = this.inputField.findIndex((x: any) => { return x?.name?.toUpperCase() === "FROMDATE" })
          if (idx > 0) {
            this.inputField.reverse();
          }
          this.dataSource = new MatTableDataSource(this.inputField as ReportInputField[]);

        }
      );
    }
  }

  remove(event: any) {
    this.inputField.splice(event.name, 1);
    this.dataSource = new MatTableDataSource(this.inputField as ReportInputField[]);

  }

  fetchReport() {
    //added custom code for date field handling need to review this 
    let obj: any = new Object();

    Object.keys(this.teller).forEach(key => {
      if (key.endsWith('Date') || key.endsWith('date'))
        obj[key] = this.datePipe.transform(this.teller[key], 'dd/MMM/yyyy');
      else
        obj[key] = this.teller[key];
    });
    let formInputCount = Object.keys(this.teller).length;
    let reportInputCount = Object.keys(this.inputField).length;

    if (reportInputCount !== formInputCount) {
      this.toast.error('Please select input field(s)');
      return;
    }

    let req = {
      inputFields: this.inputField,
      inputParams: obj,
      query: this.firstFormGroup.value.query,
      reportName: this.firstFormGroup.value.name,
      targetDb: this.firstFormGroup.value.targetDb,
    }
    this.reportAdminService.fetchReport(req).subscribe(
      data => {
        if (data && data.success) {
          this.fetchReportList = data['columns'];
          this.fetchReportList.sort((a: any, b: any) => a.columnOrder - b.columnOrder)

          this.fetchReportdataSource = new MatTableDataSource(this.fetchReportList as ResultColumn[]);
          this.fetchData = data['data'];

          this.displayColumnsByColumnOrder();
          this.fetchReportData = new MatTableDataSource(this.fetchData);
          this.isFetchSuccess = true;
        }
      },
    );
  }

  displayColumnsByColumnOrder() {
    this.fetchReportDataColumns = [];
    this.fetchReportList.forEach((column: any) => {
      this.fetchReportDataColumns.push({ name: column.title, label: column.title });
    })

    this.fetchReportData = new MatTableDataSource(this.fetchData);

  }

  colUp(event: any) {
    if (event.columnOrder > 0) {
      let index = event.columnOrder;
      this.fetchReportList.forEach((element: any) => {
        if (element == event) {
          element.columnOrder = index - 1
        } else if (element.columnOrder == index - 1) {
          element.columnOrder = index;
        }
      });
      this.fetchReportList.sort((a: any, b: any) => a.columnOrder - b.columnOrder)
      this.fetchReportdataSource = new MatTableDataSource(this.fetchReportList as ResultColumn[]);
      this.displayColumnsByColumnOrder();
    }
  }

  colDown(event: any) {
    if (event.columnOrder < this.fetchReportList.length) {
      let index = event.columnOrder;
      this.fetchReportList.forEach((element: any) => {
        if (element == event) {
          element.columnOrder = index + 1
        }
        else if (element.columnOrder == index + 1) {
          element.columnOrder = index;
        }
      });
      this.fetchReportList.sort((a: any, b: any) => a.columnOrder - b.columnOrder)
      this.displayColumnsByColumnOrder();
      this.fetchReportdataSource = new MatTableDataSource(this.fetchReportList as ResultColumn[]);
    }
  }

  saveReport() {
    if (this.checkReport == 'Edit') {
      this.fetchReportList.forEach((element: any, index: any) => {
        element.columnOrder = index + 1;
      });
      let request = {
        id: this.UserAdmin.id,
        name: this.firstFormGroup.value.name,
        title: this.firstFormGroup.value.title,
        query: this.firstFormGroup.value.query,
        subTitleTemplate: this.firstFormGroup.value.subTitleTemplate,
        fileNameQuery: this.firstFormGroup.value.fileNameQuery,
        inputFields: this.inputField,
        resultColumns: this.fetchReportList,
        uiCategoryId: this.firstFormGroup.value.selectedReport
      };
      this.reportAdminService.saveReport(request).subscribe(
        data => {
          this.router.navigate(["reports"]);
        },
      );
    } else if (this.checkReport == 'Add') {
      this.fetchReportList.forEach((element: any, index: any) => {
        element.columnOrder = index + 1;
      });
      let request = {
        name: this.firstFormGroup.value.name,
        title: this.firstFormGroup.value.title,
        query: this.firstFormGroup.value.query,
        subTitleTemplate: this.firstFormGroup.value.subTitleTemplate,
        fileNameQuery: this.firstFormGroup.value.fileNameQuery,
        inputFields: this.inputField,
        resultColumns: this.fetchReportList,
        uiCategoryId: this.firstFormGroup.value.selectedReport
      };
      this.reportAdminService.saveReportAdd(request).subscribe(
        data => {
          this.router.navigate(["reports"]);
        },
      );
    }
  }

  cancel() {
    this.router.navigate(["reports"]);
  }
}
