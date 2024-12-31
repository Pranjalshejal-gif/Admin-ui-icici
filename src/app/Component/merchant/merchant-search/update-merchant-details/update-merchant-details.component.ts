import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigData } from 'src/app/models/config_data';
import { MerchantService } from 'src/app/Services/merchant.service';
import config from '../../../../../assets/config.json';
import { UserService } from 'src/app/Services/user.service';
import { HelperService } from 'src/app/Services/helper.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-update-merchant-details',
  templateUrl: './update-merchant-details.component.html',
  styleUrls: ['./update-merchant-details.component.scss']
})
export class UpdateMerchantDetailsComponent implements OnInit {

  editForm: FormGroup;
  merchantDetails: any;
  configData: ConfigData = config;
  emailPattern: string;

  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private searchMerchant: MerchantService,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private helper: HelperService
  ) {
    this.merchantDetails = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.emailPattern = this.userService.emailUIRegex;
    this.editForm = this.fb.group({
      mid: [{ value: this.merchantDetails.mid, disabled: true }, [Validators.pattern(RegularExpression.ALPHA_NUMERIC)]],
      number: [{ value: this.merchantDetails.customerDetails.mobile.slice(1), disabled: true }, [Validators.required, Validators.pattern(RegularExpression.MOBILE_10_DIGIT)]],
      externalMid: [this.merchantDetails.externalMid, Validators.pattern(RegularExpression.ALPHA_NUMERIC)],
      externalTid: [this.merchantDetails.externalTid, Validators.pattern(RegularExpression.ALPHA_NUMERIC)],
      merchantName: [this.merchantDetails['merchant-name'], [Validators.required, Validators.pattern(RegularExpression.MERCHANT_NAME)]],
      legalName: [{ value: this.merchantDetails['legal-name'], disabled: true }, [Validators.required, Validators.pattern(RegularExpression.MERCHANT_NAME)]],
      pan: [this.merchantDetails.pan, [Validators.required, Validators.pattern(RegularExpression.PAN)]],
      address: [this.merchantDetails.customerDetails.address, Validators.required],
      registeredNumber: [{ value: this.merchantDetails.customerDetails.mobile.slice(1), disabled: true }, [Validators.required, Validators.pattern(RegularExpression.MOBILE_10_DIGIT)]],
      email: [this.merchantDetails.email, [Validators.pattern(this.emailPattern), Validators.required]],
      mcc: [this.merchantDetails.mcc, [Validators.required, Validators.pattern(RegularExpression.MCC)]],
      preferredWalletName: [this.merchantDetails.preferredWalletName, Validators.pattern(RegularExpression.PREFFERED_WALLET_NAME)],
      account: [this.merchantDetails.account, [Validators.required, Validators.pattern(RegularExpression.BANK_ACCOUNT)]],
      "boarding-type": [this.merchantDetails['boarding-type'], Validators.required],
      aggregatorEmail: [this.merchantDetails.aggregatorEmail, [Validators.pattern(RegularExpression.EMAIL)]],
      "ownership-type": [this.merchantDetails['ownership-type'], Validators.required],
      allowInwardTxn: [this.merchantDetails.allowInwardTxn, Validators.required],
      allowOutwardTxn: [this.merchantDetails.allowOutwardTxn, Validators.required],
      allowRefund: [this.merchantDetails.allowRefund, Validators.required],
      ifsc: [{ value: this.merchantDetails.ifsc, disabled: true }, [Validators.required, Validators.pattern(RegularExpression.IFSC)]],
      sweepBalanceDayEnd: [this.merchantDetails.sweepBalanceDayEnd, Validators.required],
      notifySms: [this.merchantDetails.notifySms],
      notifyCallback: [this.merchantDetails.notifyCallback],
      sendMisToMid: [this.merchantDetails.sendMisToMid],
      sendMisToAggregator: [this.merchantDetails.sendMisToAggregator],
      genere: [this.merchantDetails.genere, Validators.required],
      payoutAllowed: [this.merchantDetails.payoutAllowed],
      enableOffUsPay: [this.merchantDetails.enableOffUsPay === 'Y' ? true : false],
    });

    this.editForm.get('boarding-type')?.valueChanges.subscribe(
      value => {
        if (value !== 'AGGREGATOR') {
          this.editForm.get('sendMisToAggregator')?.setValue(false);
        }
      });
  }

  submit() {

    // stop here if form is invalid
    if (this.editForm.invalid) {
      this.helper.errorResponse(Constants.INVALID_FORM_MSG)
      return;
    }

    if (this.editForm.value['boarding-type'] == "AGGREGATOR" && this.helper.isNullorUndefined(this.editForm.value.aggregatorEmail)) {
      this.helper.errorResponse("Aggregator Email is required");
      return;
    }

    if (this.merchantDetails['merchant-name'] == this.editForm.value.merchantName &&
      this.merchantDetails['legal-name'] == this.editForm.value.legaName &&
      this.merchantDetails.externalMid == this.editForm.value.externalMid &&
      this.merchantDetails.externalTid == this.editForm.value.externalTid &&
      this.merchantDetails.pan == this.editForm.value.pan &&
      this.merchantDetails.customerDetails.address == this.editForm.value.address &&
      this.merchantDetails.email == this.editForm.value.email &&
      this.merchantDetails.aggregatorEmail == this.editForm.value.aggregatorEmail &&
      this.merchantDetails.mcc == this.editForm.value.mcc &&
      this.merchantDetails.account == this.editForm.value.account &&
      this.merchantDetails.ifsc == this.editForm.value.ifsc &&
      this.merchantDetails.allowInwardTxn == this.editForm.value.allowInwardTx &&
      this.merchantDetails.allowOutwardTxn == this.editForm.value.allowOutwardTxn &&
      this.merchantDetails.allowRefund == this.editForm.value.allowRefund &&
      this.merchantDetails.sweepBalanceDayEnd == this.editForm.value.sweepBalanceDayEnd &&
      this.merchantDetails['boarding-type'] == this.editForm.value['boarding-type'] &&
      this.merchantDetails['ownership-type'] == this.editForm.value['sweepBalanceDayEnd'] &&
      this.merchantDetails.notifySms == this.editForm.value.notifySms &&
      this.merchantDetails.notifyCallback == this.editForm.value.notifyCallback &&
      this.merchantDetails.preferredWalletName == this.editForm.value.preferredWalletName &&
      this.merchantDetails.sendMisToMid == this.editForm.value.sendMisToMid &&
      this.merchantDetails.sendMisToAggregator == this.editForm.value.sendMisToAggregator &&
      this.merchantDetails.genere == this.editForm.value.genere &&
      this.merchantDetails.payoutAllowed == this.editForm.value.payoutAllowed &&
      this.merchantDetails.enableOffUsPay == this.editForm.value.enableOffUsPay
    ) {
      this.helper.errorResponse(Constants.DATA_NO_CHANGES);
      return
    }
    let request = {
      "merchant-name": this.editForm.value['merchantName'],
      "legal-name": this.merchantDetails['legal-name'],
      mcc: this.editForm.value.mcc,
      mid: this.merchantDetails.mid,
      "boarding-type": this.editForm.value['boarding-type'],
      "ownership-type": this.editForm.value['ownership-type'],
      externalMid: this.editForm.value.externalMid,
      externalTid: this.editForm.value.externalTid,
      channel: this.merchantDetails.channel,
      email: this.editForm.value.email,
      aggregatorEmail: this.editForm.value.aggregatorEmail,
      pan: this.editForm.value.pan,
      notifySms: this.editForm.value.notifySms,
      notifyCallback: this.editForm.value.notifyCallback,
      allowInwardTxn: this.editForm.value.allowInwardTxn,
      allowOutwardTxn: this.merchantDetails.allowOutwardTxn,
      allowRefund: this.merchantDetails.allowRefund,
      sweepBalanceDayEnd: this.editForm.value.sweepBalanceDayEnd,
      preferredWalletName: this.editForm.value.preferredWalletName,
      account: this.editForm.value.account,
      ifsc: this.merchantDetails.ifsc,
      address: this.editForm.value.address,
      mobile: this.merchantDetails.customerDetails.mobile.slice(1),
      registerMob: this.merchantDetails.customerDetails.mobile.slice(1),
      sendMisToMid: this.editForm.value.sendMisToMid,
      sendMisToAggregator: this.editForm.value.sendMisToAggregator,
      genere: this.editForm.value.genere,
      payoutAllowed: this.editForm.value.payoutAllowed,
      enableOffUsPay: this.editForm.value.enableOffUsPay
    };

    this.searchMerchant.update(request).subscribe(
      data => {
        if (data && data.success)
          this.router.navigate([`merchant-search`]);
        else
          this.helper.errorResponse(data.message);
      },
    );
  }

  onCancel() {
    this.location.back();
  }
}
