import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import config from '../../../../assets/config.json';
import { CustomerData } from 'src/app/models/customer_data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigData } from 'src/app/models/config_data';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/Services/shared.service';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';
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
  selector: 'app-blacklist-customer-history',
  templateUrl: './blacklist-customer-history.component.html',
  styleUrls: ['./blacklist-customer-history.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }]
})
export class BlacklistCustomerHistoryComponent implements OnInit {
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

  constructor(private router: Router, private fb: FormBuilder, private toast: ToastrService,
    private datePipe: DatePipe, private sharedSer: SharedService,
    private blacklistService: BlacklistCustomerService) {
    this.Columns = this.blacklistService.HistoryColumns;
    this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      blockValue: [''],
      srNumber: ['']
    });
    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
  }

  ngOnInit(): void {
  }

  search() {
    let searchForm = this.searchForm
    let checkValidData = (!isNullorUndefined(searchForm.get('fromDate')?.value) && !isNullorUndefined(searchForm.get('toDate')?.value))
      || !isNullorUndefined(searchForm.get('blockValue')?.value) || !isNullorUndefined(searchForm.get('srNumber')?.value)

    if (this.searchForm.invalid) {
      this.showData = false;
      return;
    } else if (!checkValidData) {
      this.toast.error("Please select at least one search criteria !");
      this.atLeastOneRequired = false;
      this.showData = false;
    } else {
      var obj = this.buildSearchFilter(this.searchForm);
      this.blacklistService.blacklistHistory(obj).subscribe(r => {
        if (r && r.success && typeof (r.data) == "object") {
          Object.keys(r.data).forEach(key => {
            if (r.data[key]['status'] == 'B') {
              r.data[key]['status'] = 'BLOCK'
            }
            if (r.data[key]['status'] == 'U') {
              r.data[key]['status'] = 'UNBLOCK'
            }
            if (r.data[key]['makerCheckerStatus'] == 'P') {
              r.data[key]['makerCheckerStatus'] = 'PENDING'
            }
            if (r.data[key]['makerCheckerStatus'] == 'A') {
              r.data[key]['makerCheckerStatus'] = 'APPROVED'
            }
            if (r.data[key]['makerCheckerStatus'] == 'R') {
              r.data[key]['makerCheckerStatus'] = 'REJECTED'
            }
            if (r.data[key]['makerCheckerStatus'] == 'E') {
              r.data[key]['makerCheckerStatus'] = 'ERROR'
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