import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/Services/helper.service';
import { Constants } from 'src/app/Shared/constants';
import { PayoutService } from 'src/app/Services/payout.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { RegularExpression } from 'src/app/Shared/regular-expression';


@Component({
  selector: 'app-payout-history',
  templateUrl: './payout-history.component.html',
  styleUrls: ['./payout-history.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: HelperService.MY_FORMATS }]
})

export class PayoutHistoryComponent implements OnInit {
  @ViewChild('target') private targetElement: ElementRef;
  searchDisbursementForm: FormGroup;
  searchMerchantForm: FormGroup;
  showData: boolean = false;
  dataSourceMerchant: MatTableDataSource<any>;
  Columns: string[];
  atLeastOneRequired: boolean = true;
  merchantData: any;
  disbursmentData: boolean = false;
  disbursmentHistory: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  panelOpen: boolean = true;
  load: any;
  customer: any = {};
  minDateToFinish = new Subject<string>();
  minDate: Date;
  today = new Date();
  dataSource: any = [];
  txnData: MatTableDataSource<any>;
  data: any;
  showMe = false;
  txnColumns: string[];
  spanContent: string;
  dateFormatHint: string = Constants.DATE_FORMAT_HINT;


  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }
  constructor(private disbursment: PayoutService, private fb: FormBuilder, private router: Router,
    private datePipe: DatePipe, private helper: HelperService) {

    this.Columns = this.disbursment.Columns;
    this.txnColumns = this.disbursment.columnsHistoryDisburement

    this.searchMerchantForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      txnType: [''],
      merchantName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      legalName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      mid: ['', Validators.pattern(RegularExpression.ALPHA_NUMERIC)],
    });

    this.searchDisbursementForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      txnType: [''],
      payeeMobile: [''],
      payeeAccNo: ['']


    });


    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
  }
  ngOnInit(): void {
    //this is required method
  }
  //Search Merchant Method 
  merchantSearch() {
    if (this.searchMerchantForm.invalid) {
      return;
    }
    let valid = this.searchMerchantForm;
    if (this.helper.isNullorUndefined(valid.get('merchantName')?.value) && this.helper.isNullorUndefined(valid.get('legalName')?.value) &&
      this.helper.isNullorUndefined(valid.get('mid')?.value)) {
      this.atLeastOneRequired = false;
      this.helper.errorResponse("At least one search criteria is required");
    } else {
      let request = {
        merchantName: this.searchMerchantForm.value.merchantName,
        legalName: this.searchMerchantForm.value.legalName,
        mid: this.searchMerchantForm.value.mid,
        "allowOutwardTxn": true,
        "payoutAllowed": true,

      }
      this.disbursment.merchantSearch(request).subscribe(res => {
        if (res && res.success) {
          this.dataSourceMerchant = new MatTableDataSource(res.data);
          this.atLeastOneRequired = true;
          this.showData = true;
          this.disbursmentData = false;
          this.disbursmentHistory = false;

        }
        else {
          this.helper.errorResponse(res.message);
        }
      });

    }

  }
  // scroll method
  scrollToElement(): void {
    const element = this.targetElement.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'end'
      });
    }
  }

  //Event for wallet hypelink
  addDatainViewProfile(res: any) {
    this.disbursmentData = true;
    this.disbursmentHistory = false;
    this.reset();

    if (res && res.customer) {

      this.customer = res;
      this.searchDisbursementForm.value.mid = this.customer.mid;

      this.disbursmentData = true;

      setTimeout(() => {
        this.scrollToElement();
      }, 0);

    }
  }

  reset() {
    this.searchDisbursementForm.reset();
  }


  //Search Disburemsmet Method 
  search() {

    let valid = this.searchDisbursementForm
    let checkValidData = this.helper.isNullorUndefined(valid.get('fromDate')?.value) && this.helper.isNullorUndefined(valid.get('toDate')?.value) && this.helper.isNullorUndefined(valid.get('payeeMobile')?.value) && this.helper.isNullorUndefined(valid.get('payeeAccNo')?.value)
    this.atLeastOneRequired = false;
    if (this.searchDisbursementForm.invalid) {
      this.showData = true;
      return;
    } else if (checkValidData) {
      this.atLeastOneRequired = false;
      this.disbursmentHistory = false;
      this.helper.errorResponse("At least one search criteria is required");

    }
    else {
      var obj = this.buildSearchFilter(this.searchDisbursementForm);
      obj['mid'] = this.customer.mid;

      this.disbursment.disbursmentHistory(obj).subscribe(r => {
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
            if (r.data[key]['payoutStatus'] == 'V') {
              r.data[key]['payoutStatus'] = 'Void'
            }
            if (r.data[key]['payoutStatus'] == 'P') {
              r.data[key]['payoutStatus'] = 'Pending'
            }
            if (r.data[key]['payoutStatus'] == 'C') {
              r.data[key]['payoutStatus'] = 'Completed'
            }
          });
          this.dataSource = r.data;
          this.txnData = new MatTableDataSource(this.dataSource);

          this.showData = true;
          this.panelOpen = false;
          this.disbursmentHistory = true;

          setTimeout(() => {
            this.scrollToElement();
          }, 0);
        }
        else {
          this.disbursmentHistory = false;
          this.helper.errorResponse(r.data);
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
  setDate(fromDate: Date, toDate: Date, obj: any) {
    if (this.helper.isNullorUndefined(toDate)) {
      obj['toDate'] = fromDate;
    }
    else if (this.helper.isNullorUndefined(fromDate)) {
      obj['fromDate'] = toDate;
    }
  }
}