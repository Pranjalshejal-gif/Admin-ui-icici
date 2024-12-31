import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { MerchantOnboardService } from 'src/app/Services/merchant-onboarding.service';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { HelperService } from '../../../Services/helper.service';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-merchant-onboarding',
  templateUrl: './merchant-onboarding.component.html',
  styleUrls: ['./merchant-onboarding.component.scss']
})
export class MerchantOnboardingComponent implements OnInit {

  onboardingForm: FormGroup;
  isValid: boolean = false;
  isInvalid: boolean = false;;
  emailPattern: string;

  constructor(private fb: FormBuilder, private merchantOnboard: MerchantOnboardService,
    private router: Router, private location: Location, private userService: UserService, private helper: HelperService) {

  }

  showAggregatorEmail = false;

  ngOnInit(): void {
    this.emailPattern = this.userService.emailUIRegex;
    this.onboardingForm = this.fb.group({
      externalMid: ['', Validators.pattern],
      externalTid: ['', Validators.pattern],
      merchantName: ['', Validators.required],
      legalName: ['', Validators.required],
      pan: ['', [Validators.required, Validators.pattern]],
      registeredAddress: ['', Validators.required],
      ContactNumber: ['', [Validators.required, Validators.pattern]],
      registeredContactNumber: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.pattern(this.emailPattern), Validators.required]],
      aggregatorEmail: ['', [Validators.pattern(RegularExpression.EMAIL)]],
      mcc: ['', [Validators.required, Validators.pattern]],
      bankAccount: ['', [Validators.required, Validators.pattern]],
      ifsc: ['', [Validators.required, Validators.pattern]],
      preferredWalletName: ['', Validators.pattern],
      boardingType: ['', Validators.required],
      ownershipType: ['', Validators.required],
      inwardCollect: ['', Validators.required],
      allowOutwardTxn: [false,],
      sweepBalance: ['', Validators.required],
      RefundAllowed: [false,],
      notifySms: [false],
      notifyCallback: [false],
      sendMisToMid: [false],
      sendMisToAggregator: [false],
      genere: ['', Validators.required],
      payoutAllowed: [false],
      enableOffUsPay: [false],
    });
    this.onboardingForm.get('boardingType')?.valueChanges.subscribe(
      value => {
        const aggregatorEmailControl: any = this.onboardingForm.get('aggregatorEmail');
        if (value === 'AGGREGATOR') {
          aggregatorEmailControl.setValidators([
            Validators.required,
            Validators.pattern(RegularExpression.EMAIL)
          ]);
          this.showAggregatorEmail = true;
        } else if (value === 'BANK') {
          aggregatorEmailControl.clearValidators();
          aggregatorEmailControl.updateValueAndValidity();
          this.showAggregatorEmail = false;
        }
      });
  }
  onBoardingTypeChange(event: MatSelectChange): void {
    const boardingType = event.value;
    if (boardingType === 'BANK') {
      this.onboardingForm.get('sendMisToAggregator')?.setValue(false);
    }
  }

  submit() {
    if (this.onboardingForm.invalid) {
      this.helper.errorResponse(Constants.INVALID_FORM_MSG);
      return;
    }
    else {
      let request = {
        "merchant-name": this.onboardingForm.value.merchantName,
        "legal-name": this.onboardingForm.value.legalName,
        "mcc": this.onboardingForm.value.mcc,
        "boarding-type": this.onboardingForm.value.boardingType,
        "ownership-type": this.onboardingForm.value.ownershipType,
        "externalMid": Number(this.onboardingForm.value.externalMid),
        "externalTid": Number(this.onboardingForm.value.externalTid),
        "address": this.onboardingForm.value.registeredAddress,
        "mobile": String(this.onboardingForm.value.ContactNumber),
        "registerMob": String(this.onboardingForm.value.registeredContactNumber),
        "preferredWalletName": this.onboardingForm.value.preferredWalletName,
        "email": this.onboardingForm.value.email,
        "aggregatorEmail": this.onboardingForm.value.aggregatorEmail,
        "pan": this.onboardingForm.value.pan,
        "allowInwardTxn": this.onboardingForm.value.inwardCollect,
        "allowOutwardTxn": this.onboardingForm.value.allowOutwardTxn,
        "allowRefund": this.onboardingForm.value.RefundAllowed,
        "sweepBalanceDayEnd": this.onboardingForm.value.sweepBalance,
        "account": String(this.onboardingForm.value.bankAccount),
        "ifsc": this.onboardingForm.value.ifsc,
        "notifySms": this.onboardingForm.value.notifySms,
        "notifyCallback": this.onboardingForm.value.notifyCallback,
        "sendMisToMid": this.onboardingForm.value.sendMisToMid,
        "sendMisToAggregator": this.onboardingForm.value.sendMisToAggregator,
        "genere": this.onboardingForm.value.genere,
        "payoutAllowed": this.onboardingForm.value.payoutAllowed,
        "enableOffUsPay": this.onboardingForm.value.enableOffUsPay,
      }

      this.merchantOnboard.addMerchant(request).subscribe(
        data => {
          if (data && data.success) {

            this.router.navigate(['/merchant-onboarding']);
            this.reset();

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
    for (let value in this.onboardingForm.controls) {
      this.onboardingForm.controls[value].setValue('');
      this.onboardingForm.controls[value].setErrors(null);
    }
  }

  validWallet() {
    this.isValid = true;
    this.isInvalid = false;
    if (this.onboardingForm.get('pWalletId')?.value == "test") {
      this.isValid = false;
      this.isInvalid = true;
    };
  }

  bulkUpload() {
    this.router.navigate(['/merchant-onboarding/bulk-upload']);
  }


}
