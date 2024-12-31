import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VoucherService } from 'src/app/Services/voucher.service';
import { UserService } from 'src/app/Services/user.service';
import { RegularExpression } from 'src/app/Shared/regular-expression';
import { HelperService } from 'src/app/Services/helper.service';
import config from '../../../../../assets/config.json';
import { Constants } from 'src/app/Shared/constants';

@Component({
  selector: 'app-update-voucher',
  templateUrl: './update-voucher.component.html',
  styleUrls: ['./update-voucher.component.scss']
})

export class UpdateVoucherComponent implements OnInit {

  updateVoucherForm: any = FormGroup;
  emailPattern: string;
  voucherDetails: any;
  gffPreloadAmount: any = config.gffPreloadAmount;

  constructor(private fb: FormBuilder,
    private router: Router,
    private helper: HelperService,
    private voucherService: VoucherService,
    private userService: UserService) {
    this.voucherDetails = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.updateVoucherForm = this.fb.group({
      code: this.voucherDetails.code,
      amount: ['', [Validators.pattern(RegularExpression.VOUCHER_AMOUNT)]],
      email: [this.voucherDetails.email, [Validators.required, Validators.pattern(this.userService.emailUIRegex)]],
      refId: ['', [Validators.pattern(RegularExpression.ALPHA_NUMERIC)]]
    });
  }

  onSubmit() {
    if (this.updateVoucherForm.invalid) {
      this.helper.errorResponse(Constants.INVALID_FORM_MSG);
      return;
    }
    if (this.updateVoucherForm.value.amount !== '' && this.updateVoucherForm.value.refId == '') {
      this.helper.errorResponse(Constants.PLEASE_ENTER_REFERENCE_ID);
      return;
    }
    if (this.updateVoucherForm.value.refId !== ''
      && (this.updateVoucherForm.value.amount == '' || this.updateVoucherForm.value.amount == null)) {
      this.helper.errorResponse(Constants.PLEASE_ENTER_AMOUNT);
      return;
    }
    else {
      const request = {
        id: this.voucherDetails.id,
        voucherCode: this.updateVoucherForm.value.code,
        email: this.updateVoucherForm.value.email,
        ...(this.gffPreloadAmount && { amount: this.updateVoucherForm.value.amount, refId: this.updateVoucherForm.value.refId })
      };

      this.voucherService.updateVoucher(request).subscribe(
        data => {
          if (data && data.success) {
            this.back();
          } else {
            this.helper.errorResponse(data.message);
          }
        }
      );
    }
  }


  back() {
    this.router.navigate([`voucher-management/search-voucher`]);
  }
}
