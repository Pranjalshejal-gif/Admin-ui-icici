import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayoutService } from 'src/app/Services/payout.service';
import { SearchHistory } from 'src/app/Services/bulk-history.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { HelperService } from 'src/app/Services/helper.service';


@Component({
  selector: 'app-app-rej-payout',
  templateUrl: './app-rej-payout.component.html',
  styleUrls: ['./app-rej-payout.component.scss']
})
export class AppRejPayoutComponent implements OnInit {
  @ViewChild('target') private targetElement: ElementRef;
  searchForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  indexArray: string[] = [];
  merPayoutPayload: any = {};
  dataSource: any = [];
  showData: boolean;
  customer: any = {};
  Columns: string[];
  atLeastOneRequired: boolean = true;
  dataSourceMerchant: MatTableDataSource<any>;
  disbursmentData: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Approve and Reject table columns
  ColumnsApprej: any[] = [
    { name: 'selectAction', label: 'Approve' },
    { name: 'id', label: 'Sr.No' },
    { name: 'payeeAccNo', label: 'Payee AccNo' },
    { name: 'mid', label: 'MID' },
    { name: 'created', label: 'Upload Date' },
    { name: 'uploadType', label: 'Upload Type' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'payeeMobile', label: 'Payee Mobile' },
    { name: 'payeeVPA', label: 'Payee VPA' },
    { name: 'amount', label: 'Total Amount' },
    { name: 'status', label: 'Status' },
    { name: 'remarks', label: 'Remarks' },
    { name: 'fileName', label: 'File Name' }
  ];

  constructor(private fb: FormBuilder, public dialog: MatDialog, private apprejdisbursment: PayoutService, private router: Router, private helper: HelperService) { }

  ngOnInit(): void {

    this.Columns = this.apprejdisbursment.disbursmentColumns;
    this.searchForm = this.fb.group({
      merchantName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      legalName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      mid: ['', Validators.pattern(RegularExpression.ALPHA_NUMERIC)],

    });

  }

  search() {
    //Initiates a search for disbursement records with a specified status for the current customer for Approve/Reject.
    let request = {
      status: "P",
      mid: this.customer.mid,
    }
    this.apprejdisbursment.getByStatus(request).subscribe(res => {
      if (res && res.success) {
        var arr: SearchHistory[] = res.data;
        arr.forEach((obj: any) => {
          obj.status = obj.status === "P" ? 'PENDING' : obj.status === "C" ? 'COMPLETED' : obj.status === "A" ? 'APPROVED' : obj.status === "R" ? 'REJECTION' : obj.status === "I" ? 'IN_PROGRESS' : '';
        });
        this.dataSource = new MatTableDataSource(res.data);

      }
    });
  }
  //Scroll Method
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

    if (res && res.customer) {
      this.customer = res;
      this.disbursmentData = true;
      setTimeout(() => {
        this.scrollToElement();
      }, 0);

    }
    this.search();
  }

  //Merchant Search Method
  Merchantsearch() {
    if (this.searchForm.invalid) {
      return;
    }
    let valid = this.searchForm;
    if (this.helper.isNullorUndefined(valid.get('merchantName')?.value) && this.helper.isNullorUndefined(valid.get('legalName')?.value) &&
      this.helper.isNullorUndefined(valid.get('mid')?.value)) {
      this.atLeastOneRequired = false;
      this.helper.errorResponse("At least one search criteria is required");
    } else {
      let request = {
        merchantName: this.searchForm.value.merchantName,
        legalName: this.searchForm.value.legalName,
        mid: this.searchForm.value.mid,
        "allowOutwardTxn": true,
        "payoutAllowed": true,

      }
      this.apprejdisbursment.merchantSearch(request).subscribe(res => {
        if (res && res.success) {
          this.dataSourceMerchant = new MatTableDataSource(res.data);
          this.atLeastOneRequired = true;
          this.showData = true;


        }
        else {
          this.helper.errorResponse(res.message);
        }
      });

    }

  }
}

