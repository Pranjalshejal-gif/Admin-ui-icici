import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/Services/user.service';
import { PayoutService } from 'src/app/Services/payout.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { HelperService } from 'src/app/Services/helper.service';

@Component({
  selector: 'app-add-payout',
  templateUrl: './add-payout.component.html',
  styleUrls: ['./add-payout.component.scss']
})
export class AddPayoutComponent implements OnInit {
  @ViewChild('target') private targetElement: ElementRef;
  showData: boolean = false;
  isValid: boolean = false;
  isInvalid: boolean = false;
  firstFormGroup: FormGroup;
  isFormValid = false;
  Columns: string[];
  searchForm: FormGroup;
  disbursmentData: boolean = false;
  customer: any = {};
  atLeastOneRequired: boolean = true;
  dataSourceMerchant: MatTableDataSource<any>;
  txnData: any = [];

  constructor(
    private fb: FormBuilder,
    private searchMerchant: PayoutService,
    private router: Router,
    private userService: UserService,
    private helper: HelperService) {

  }

  ngOnInit(): void {

    //Add Disburesmet form Control
    this.firstFormGroup = this.fb.group({
      payeeMobile: ['', [Validators.pattern(RegularExpression.MOBILE_10_DIGIT), Validators.minLength(10), Validators.maxLength(10)]],
      txnType: ['PAYOUT', Validators.required],
      remarks: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      amount: ['', [Validators.required, Validators.pattern(RegularExpression.AMOUNT), Validators.min(0.5), Validators.minLength(1), Validators.maxLength(7)]],
      refundOrgMerchantRef: [''],
      payeeVPA: [''],
      refundOrgTxnId: [''],
      payeeWalletAddress: ['']
    });
    this.Columns = this.searchMerchant.disbursmentColumns;

    //Search Merchant form Control
    this.searchForm = this.fb.group({
      merchantName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      legalName: ['', Validators.pattern(RegularExpression.MERCHANT_NAME)],
      mid: ['', Validators.pattern(RegularExpression.ALPHA_NUMERIC)],

    });
  }

  //Add Disburesment 
  submit() {
    let valid = this.firstFormGroup;
    const payeeMobile: any = this.firstFormGroup.get('payeeMobile');
    const payeeWalletAddress: any = this.firstFormGroup.get('payeeWalletAddress');
    if (this.helper.isNullorUndefined(valid.get('payeeMobile')?.value) && this.helper.isNullorUndefined(valid.get('payeeWalletAddress')?.value)) {
      this.atLeastOneRequired = false;
      this.helper.errorResponse("Please Enter Payee Mobile or Payee Wallet Address");

      payeeMobile.setValidators([
        Validators.required,
      ]);
      payeeWalletAddress.setValidators([
        Validators.required,
      ]);
      payeeMobile.updateValueAndValidity();
      payeeWalletAddress.updateValueAndValidity();
    } else {
      payeeWalletAddress.clearValidators();
      payeeMobile.clearValidators();
      payeeWalletAddress.updateValueAndValidity();
      payeeMobile.updateValueAndValidity();
    }

    if (this.firstFormGroup.invalid) {
      return;
    }
    else {
      let request = {
        "txnType": String(this.firstFormGroup.value.txnType),
        "payeeMobile": String(this.firstFormGroup.value.payeeMobile),
        "amount": String(this.firstFormGroup.value.amount),
        "remarks": this.firstFormGroup.value.remarks,
        "refundOrgMerchantRef": this.firstFormGroup.value.refundOrgMerchantRef,
        "payeeWalletAddress": this.firstFormGroup.value.payeeWalletAddress,
        "payeeVPA": this.firstFormGroup.value.payeeVPA,
        "refundOrgTxnId": this.firstFormGroup.value.refundOrgTxnId,
        "mid": this.customer.mid,

      }
      this.searchMerchant.addDisbursment(request).subscribe(
        data => {
          if (data && data.success) {

            this.userService.reloadCurrentRoute();
          }
          else {
            this.helper.errorResponse(data && data.message);
          }
        },
      );
      this.isInvalid = false;
      this.isValid = false
    }
  }

  reset() {
    for (let value in this.firstFormGroup.controls) {
      this.firstFormGroup.controls[value].setValue('');
      this.firstFormGroup.controls[value].setErrors(null);
    }
  }

  bulkUpload() {
    this.router.navigate(['/payout/add-payout/bulk-upload'], this.customer);
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
    if (res && res.customer) {
      this.customer = res;
      this.disbursmentData = true;
      setTimeout(() => {
        this.scrollToElement();
      }, 0);

    }
  }


  //Search Merchant Form
  searchmerchant() {
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
        mid: this.searchForm.value.mid,
        legalName: this.searchForm.value.legalName,
        "allowOutwardTxn": true,
        "payoutAllowed": true,

      }
      this.searchMerchant.merchantSearch(request).subscribe(res => {
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

