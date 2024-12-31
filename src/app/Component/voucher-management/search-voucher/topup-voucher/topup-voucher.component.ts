import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/Services/helper.service';
import { VoucherService } from 'src/app/Services/voucher.service';
import { Constants } from 'src/app/Shared/constants';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-topup-voucher',
  templateUrl: './topup-voucher.component.html',
  styleUrls: ['./topup-voucher.component.scss']
})

export class TopupVoucherComponent implements OnInit {

  topupVoucherForm: any = FormGroup;
  voucherDetails: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private helper: HelperService,
    private voucherService: VoucherService) {
    this.voucherDetails = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {
    this.topupVoucherForm = this.fb.group({
      code: this.voucherDetails.code,
      amount: ['', [Validators.required, Validators.pattern(RegularExpression.VOUCHER_AMOUNT)]],
      refId: ['']
    });
  }

  onSubmit() {
    if (this.topupVoucherForm.invalid) {
      this.helper.errorResponse(Constants.REQUIRED_FIELDS_MSG);
      return;
    }
    else {
      let request = {
        "voucherCode": this.topupVoucherForm.value.code,
        "amount": this.topupVoucherForm.value.amount,
        "refId": this.topupVoucherForm.value.refId
      }
      this.voucherService.topUpVoucher(request).subscribe(
        data => {
          if (data.success) {
            this.back();
          }
          else {
            this.helper.errorResponse(data.message);
          }
        },
      );
    }
  }

  back() {
    this.router.navigate([`voucher-management/search-voucher`]);
  }
}
