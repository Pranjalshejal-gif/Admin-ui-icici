import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { UserService } from 'src/app/Services/user.service';
import { SharedService } from 'src/app/Services/shared.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RegularExpression } from 'src/app/Shared/regular-expression';

@Component({
  selector: 'app-add-sponsor',
  templateUrl: './add-sponsor.component.html',
  styleUrls: ['./add-sponsor.component.scss']
})
export class AddSponsorComponent implements OnInit {
  @ViewChild('mccInput') mccInput: ElementRef<HTMLInputElement>;
  addForm: FormGroup;
  dataMccList: any = [];
  filteredMCCList: any[] = [];

  constructor(private fb: FormBuilder, private pcbdcService: PcbdcService,
    private toast: ToastrService, private userService: UserService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      nameDescription: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(RegularExpression.MOBILE_10_DIGIT)]],
      sponsorsName: ['', [Validators.required, Validators.pattern(RegularExpression.SPONSOR_NAME)]],
      type: ['', [Validators.required]],
      account: ['', [Validators.required]],
      ifsc: ['', [Validators.required, Validators.pattern(RegularExpression.IFSC)]],
      cbsCreditDebitAllowed: [true],
    })

    this.loadData();
  }

  selectedMcc(event: MatAutocompleteSelectedEvent): void {
    var mcc = event.option.value;

    const index = this.filteredMCCList.indexOf(mcc);
    if (index >= 0) {
      this.mccInput.nativeElement.value = '';
      this.toast.error('Selected entry already exisits');
      return;
    }

    this.filteredMCCList.push(mcc);
    this.mccInput.nativeElement.value = '';
    this.filteredMCCList = this.dataMccList;
  }

  removeMcc(mcc: string): void {
    const index = this.filteredMCCList.indexOf(mcc);
    if (index >= 0) {
      this.filteredMCCList.splice(index, 1);
      if (this.filteredMCCList.length === 0) {
        this.addForm.controls['nameDescription'].setValue(null);
      }
    }
  }

  onSelectMCC() {
    var selectedMCC = this.addForm.controls['nameDescription'].value;
    this.filteredMCCList = this.dataMccList.filter((mcc: any) => mcc.nameDescription.toLowerCase().includes(selectedMCC.toLowerCase())
      || mcc.mccCategory.toLowerCase().includes(selectedMCC.toLowerCase())
    );
  }

  loadData(): void {
    if (this.sharedService.dataMccList) {
      this.dataMccList = this.sharedService.dataMccList;
      this.filteredMCCList = this.dataMccList;
    }
    else {
      this.pcbdcService.getMetaData("").subscribe((res) => {
        this.dataMccList = res.data.mccList;
        this.filteredMCCList = this.dataMccList;
        this.sharedService.setPcbdcMccMetaData(res.data);
      })
    }
  }

  save() {
    if (this.addForm.invalid) {
      return;
    }

    if (this.filteredMCCList.length == 0 && this.addForm.controls['nameDescription'].value) {
      this.toast.error("MCC is not selected.");
      return;
    }

    let request = {
      "mcc": this.addForm.value.nameDescription,
      "mobile": this.addForm.value.mobile,
      "sponsorName": this.addForm.value.sponsorsName,
      "type": this.addForm.value.type,
      "account": this.addForm.value.account,
      "ifsc": this.addForm.value.ifsc,
      "cbsCreditDebitAllowed": this.addForm.value.cbsCreditDebitAllowed
    }

    this.pcbdcService.addSponsor(request).subscribe(
      res => {
        if (res && res.success) {
          this.toast.success(res.data.displayMessage);
          this.reset();
        }
        else {
          this.toast.error(res.message);
          this.reset();
        }
      },
    );
  }

  cancel() {
    this.userService.reloadCurrentRoute();
  }

  reset() {
    for (let value in this.addForm.controls) {
      this.addForm.controls[value].setValue('');
      this.addForm.controls[value].setErrors(null);
    }
  }
}
