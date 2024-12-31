import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerData } from 'src/app/models/customer_data';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ApproveRefundPayoutService } from 'src/app/Services/approve-refund-payout.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import config from '../../../../assets/config.json';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ConfigData } from 'src/app/models/config_data';
import { SharedService } from 'src/app/Services/shared.service';
import { Constants } from 'src/app/Shared/constants';

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
  selector: 'app-refund-payout-history',
  templateUrl: './refund-payout-history.component.html',
  styleUrls: ['./refund-payout-history.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class RefundPayoutHistoryComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  panelOpen: boolean = true;
  load: any;
  customer: any = {};
  showData: boolean = false;
  myData: CustomerData;
  searchForm: FormGroup;
  atLeastOneRequired: boolean = true;
  minDateToFinish = new Subject<string>();
  minDate: Date;
  Columns: string[];
  today = new Date();
  dataSource: any = [];
  txnData: MatTableDataSource<any>;
  data: any;
  showMe = false;
  configData: ConfigData = config;
  dateFormatHint: string = Constants.DATE_FORMAT_HINT;


  back() {
    this.router.navigate(['/loadhistory']);
  }
  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }
  constructor(private appSer: ApproveRefundPayoutService, private fb: FormBuilder, private router: Router,
    private toast: ToastrService, private datePipe: DatePipe, private refundHistory: ApproveRefundPayoutService, private sharedSer: SharedService) {
    this.Columns = this.refundHistory.Columns;
    this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      txnType: ['']
    });
    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
  }

  ngOnInit(): void {

  }

  search() {
    let valid = this.searchForm
    let checkValidData = isNullorUndefined(valid.get('fromDate')?.value) && isNullorUndefined(valid.get('toDate')?.value)

    if (this.searchForm.invalid) {
      this.showData = false;
      return;
    } else if (checkValidData) {
      this.atLeastOneRequired = false;
      this.showData = false;
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
      this.refundHistory.getStatusDetails(obj).subscribe(r => {
        if (r && r.success && typeof (r.data) == "object") {
          Object.keys(r.data).forEach(key => {
            if (r.data[key]['status'] == 'A') {
              r.data[key]['status'] = 'Approved'
            }
            if (r.data[key]['status'] == 'R') {
              r.data[key]['status'] = 'Rejected'
            }
            if (r.data[key]['status'] == 'P') {
              r.data[key]['status'] = 'Pending'
            }
          });
          this.dataSource = r.data;
          this.txnData = new MatTableDataSource(this.dataSource);

          this.showData = true;
          this.panelOpen = false;
        }
        else {
          this.showData = false;
          this.toast.error(r.data);
        }
      })
    }
  }

  buildSearchFilter(form: FormGroup) {
    let obj: any = new Object();

    Object.keys(form.controls).forEach(key => {
      if (!isNullorUndefined(form.get(key)?.value)) {
        if (key == 'fromDate' || key == 'toDate')
          obj[key] = this.datePipe.transform(form.get(key)?.value, 'dd-MM-yyyy');
        else
          obj[key] = form.get(key)?.value;
      }
    });
    return obj;
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
