import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HelperService } from 'src/app/Services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { UserService } from 'src/app/Services/user.service';
import { MatTable } from '@angular/material/table';
import { Location } from 'src/app/models/location';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { isEqual } from 'lodash';
import { SharedService } from 'src/app/Services/shared.service';
import { Constants } from 'src/app/Shared/constants';
import { RegularExpression } from 'src/app/Shared/regular-expression';

export interface MCC {
  mcc: string;
}

export interface City {
  cityId: string;
  cityName: string;
}

@Component({
  selector: 'app-add-sponsor-rule',
  templateUrl: './add-sponsor-rule.component.html',
  styleUrls: ['./add-sponsor-rule.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: HelperService.MY_FORMATS }]
})

export class AddSponsorRuleComponent implements OnInit {
  @ViewChild('top') private targetElement: ElementRef;
  @ViewChild(MatTable) table: MatTable<MCC>;
  @ViewChild('mccInput') mccInput: ElementRef<HTMLInputElement>;
  @ViewChild('sponsorInput') sponsorInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formGroup: FormGroup;
  addForm: FormGroup;
  mccForm: FormGroup;
  acceptanceForm: FormGroup;
  locationForm1: FormGroup;
  locationForm2: FormGroup;
  locationForm3: FormGroup;
  locationForm4: FormGroup;
  locationForm5: FormGroup;
  isSponsorNameAvailable = false;
  dataSourceMcc = [];
  filteredMCCList: any[] = [];
  selectedMCCList: any[] = [];
  selectedState: any[] = [];
  selectedCity: any[] = [];
  dataSponsorList: any = [];
  filteredSponsorList: any = [];
  dataMccList: any = [];
  dataLocationList: any[] = [];
  dataSourceState: any[] = [];
  dataCities: any[] = [];
  filteredCities1: City[] = [];
  filteredCities2: City[] = [];
  filteredCities3: City[] = [];
  filteredCities4: City[] = [];
  filteredCities5: City[] = [];
  filteredStates1: any[] = [];
  filteredStates2: any[] = [];
  filteredStates3: any[] = [];
  filteredStates4: any[] = [];
  filteredStates5: any[] = [];
  filteredCity: any[] = [];
  map = new Map<string, any>();
  derivedSponsorId: any;
  minDateToFinish = new Subject<string>();
  minDate: Date;
  today = new Date();
  grpCounter: number = 1;
  selectedSponsorDetail: any[] = [];
  dateFormatHint: string = Constants.DATE_FORMAT_HINT;

  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }

  //this is the denomination variable
  fixedValue0_5: number = 0.50
  fixedValue1: number = 1
  fixedValue2: number = 2
  fixedValue5: number = 5
  fixedValue10: number = 10
  fixedValue20: number = 20
  fixedValue50: number = 50
  fixedValue100: number = 100
  fixedValue200: number = 200
  fixedValue500: number = 500
  count: number = 0
  request: number = 0
  amount: any;
  radiusRegEx = Validators.pattern(RegularExpression.PCBDC_LOCATION_RADIUS);
  denomRegExLength = [Validators.minLength(1), Validators.maxLength(7)];

  constructor(private router: Router,
    private fb: FormBuilder, private toast: ToastrService, private pcbdcService: PcbdcService,
    private userService: UserService, private datePipe: DatePipe, private sharedService: SharedService,
    private helper: HelperService
  ) {
    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
  }

  ngOnInit(): void {

    this.loadData();

    this.pcbdcService.getSponsor().subscribe((res) => {
      this.dataSponsorList = res.data;
      this.dataSponsorList.sort((a: any, b: any) => { return a.name.localeCompare(b.name) })
      this.filteredSponsorList = this.dataSponsorList;
    })

    this.addForm = this.fb.group({
      sponsorName: ['', Validators.required],
      sponsorId: [''],
      expiry: ['', [Validators.required]],
      authType: ['', [Validators.required]],
      fixedValue0_5: 0.50,
      fixedValue1: 1,
      fixedValue2: 2,
      fixedValue5: 5,
      fixedValue10: 10,
      fixedValue20: 20,
      fixedValue50: 50,
      fixedValue100: 100,
      fixedValue200: 200,
      fixedValue500: 500,
      countfor0_5: [''],
      countfor1: ['', this.denomRegExLength],
      countfor2: ['', this.denomRegExLength],
      countfor5: ['', this.denomRegExLength],
      countfor10: ['', this.denomRegExLength],
      countfor20: ['', this.denomRegExLength],
      countfor50: ['', this.denomRegExLength],
      countfor100: ['', this.denomRegExLength],
      countfor200: ['', this.denomRegExLength],
      countfor500: ['', this.denomRegExLength],
      totalAmount: 0,
      totalQuantityAmount0_5: 0,
      totalQuantityAmount1: 0,
      totalQuantityAmount2: 0,
      totalQuantityAmount5: 0,
      totalQuantityAmount10: 0,
      totalQuantityAmount20: 0,
      totalQuantityAmount50: 0,
      totalQuantityAmount100: 0,
      totalQuantityAmount200: 0,
      totalQuantityAmount500: 0,
      totalAmountNoDenom: ['', [Validators.pattern(RegularExpression.AMOUNT), Validators.min(0.5), Validators.minLength(1), Validators.maxLength(7)]],
      transactionType: ['amount']
    });

    this.mccForm = this.fb.group({
      mccListCode: [null],
      mccTextCode: [null, [Validators.pattern(/^[0-9,]+$/), Validators.minLength(4), Validators.maxLength(7500)]],
    });

    this.acceptanceForm = this.fb.group({
      VPA: ['', [Validators.pattern(RegularExpression.VPA)]],
      WALLET: ['', [Validators.pattern(RegularExpression.OFFUS_WALLET), Validators.minLength(10), Validators.maxLength(100)]],
    });

    this.locationForm1 = this.fb.group({
      city: [''],
      state: [''],
      bufferZone: [null, this.radiusRegEx]
    });

    this.locationForm2 = this.fb.group({
      city: [''],
      state: [''],
      bufferZone: [null, this.radiusRegEx]
    });

    this.locationForm3 = this.fb.group({
      city: [''],
      state: [''],
      bufferZone: [null, this.radiusRegEx]
    });

    this.locationForm4 = this.fb.group({
      city: [''],
      state: [''],
      bufferZone: [null, this.radiusRegEx]
    });

    this.locationForm5 = this.fb.group({
      city: [''],
      state: [''],
      bufferZone: [null, this.radiusRegEx]
    });

    this.addForm.valueChanges.pipe(
      debounceTime(50) // Adjust the debounce time (in milliseconds) based on your needs
    ).subscribe(() => {
      this.calculateTotal();
    });
  }

  selectedMcc(event: MatAutocompleteSelectedEvent): void {
    var mcc = event.option.value;

    const index = this.selectedMCCList.indexOf(mcc);
    if (index >= 0) {
      this.mccInput.nativeElement.value = '';
      this.toast.error('Selected entry already exisits');
      return;
    }

    this.selectedMCCList.push(mcc);
    this.mccInput.nativeElement.value = '';
    this.filteredMCCList = this.dataMccList;
  }

  removeMcc(mcc: string): void {
    const index = this.selectedMCCList.indexOf(mcc);
    if (index >= 0) {
      this.selectedMCCList.splice(index, 1);
      if (this.selectedMCCList.length === 0) {
        this.mccForm.controls['mccListCode'].setValue(null);
      }
    }
  }

  onSponsorType() {
    var selectedSponsorDetail = this.addForm.controls['sponsorName'].value;
    this.filteredSponsorList = this.dataSponsorList.filter((sponsor: any) => {
      return sponsor.name.toLowerCase().includes(selectedSponsorDetail.toLowerCase()) ||
        sponsor.wallet.toString().toLowerCase().includes(selectedSponsorDetail.toLowerCase());
    });
  }

  selectedSponsor(event: MatAutocompleteSelectedEvent): void {
    this.isSponsorNameAvailable = true;
    var sponsor = event.option.value;
    this.selectedSponsorDetail.push(sponsor);
    this.filteredSponsorList = this.dataSponsorList;
    this.isSponsorNameAvailable = true;
  }


  onSelectMCC() {
    var selectedMCC = this.mccForm.controls['mccListCode'].value;
    this.filteredMCCList = this.dataMccList.filter((mcc: any) => mcc.nameDescription.toLowerCase().includes(selectedMCC.toLowerCase())
      || mcc.mccCategory.toLowerCase().includes(selectedMCC.toLowerCase())
    );
  }

  onStateType1() {
    this.onStateType(this.locationForm1, 1);
  }

  onCityType1() {
    this.onCityType(this.locationForm1, 1);
  }
  onStateType2() {
    this.onStateType(this.locationForm2, 2);
  }

  onCityType2() {
    this.onCityType(this.locationForm2, 2);
  }
  onStateType3() {
    this.onStateType(this.locationForm3, 3);
  }

  onCityType3() {
    this.onCityType(this.locationForm3, 3);
  }
  onStateType4() {
    this.onStateType(this.locationForm4, 4);
  }

  onCityType4() {
    this.onCityType(this.locationForm4, 4);
  }
  onStateType5() {
    this.onStateType(this.locationForm5, 5);
  }

  onCityType5() {
    this.onCityType(this.locationForm5, 5);
  }

  onStateType(locationForm: FormGroup, count: number) {
    var selectedState = locationForm.controls['state'].value;

    if (count == 1) {
      this.filteredStates1 = this.dataSourceState.filter(state => state.stateName.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (count == 2) {
      this.filteredStates2 = this.dataSourceState.filter(state => state.stateName.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (count == 3) {
      this.filteredStates3 = this.dataSourceState.filter(state => state.stateName.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (count == 4) {
      this.filteredStates4 = this.dataSourceState.filter(state => state.stateName.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (count == 5) {
      this.filteredStates5 = this.dataSourceState.filter(state => state.stateName.toLowerCase().includes(selectedState.toLowerCase()));
    }
  }

  onCityType(locationForm: FormGroup, count: number) {
    const selectedState = locationForm.controls['state'].value;
    const selectedStateId = this.dataSourceState.find(state => state.stateName.toLowerCase() === selectedState.toLowerCase())?.stateId;

    if (selectedStateId) {
      const selectedCity = locationForm.controls['city'].value;
      if (count == 1)
        this.filteredCities1 = this.dataLocationList.filter(city => city.stateId === selectedStateId && city.cityName.toLowerCase().includes(selectedCity.toLowerCase()));
      if (count == 2)
        this.filteredCities2 = this.dataLocationList.filter(city => city.stateId === selectedStateId && city.cityName.toLowerCase().includes(selectedCity.toLowerCase()));
      if (count == 3)
        this.filteredCities3 = this.dataLocationList.filter(city => city.stateId === selectedStateId && city.cityName.toLowerCase().includes(selectedCity.toLowerCase()));
      if (count == 4)
        this.filteredCities4 = this.dataLocationList.filter(city => city.stateId === selectedStateId && city.cityName.toLowerCase().includes(selectedCity.toLowerCase()));
      if (count == 5)
        this.filteredCities5 = this.dataLocationList.filter(city => city.stateId === selectedStateId && city.cityName.toLowerCase().includes(selectedCity.toLowerCase()));
    }
  }

  resetLocationFields(locationForm: FormGroup) {
    locationForm.get('city')?.reset();
    locationForm.get('bufferZone')?.reset();
  }

  reset1() {
    this.resetLocationFields(this.locationForm1);
  }

  reset2() {
    this.resetLocationFields(this.locationForm2);
  }

  reset3() {
    this.resetLocationFields(this.locationForm3);
  }

  reset4() {
    this.resetLocationFields(this.locationForm4);
  }

  reset5() {
    this.resetLocationFields(this.locationForm5);
  }

  onStateSelected1() {
    var selectedState = this.locationForm1.controls['state'].value;

    if (selectedState) {
      this.filteredCities1 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities1.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
  }

  onStateSelected2() {
    var selectedState = this.locationForm2.controls['state'].value;

    if (selectedState) {
      this.filteredCities2 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities2.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities2 = [];
    }
  }

  onStateSelected3() {
    var selectedState = this.locationForm3.controls['state'].value;

    if (selectedState) {
      this.filteredCities3 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities3.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities3 = [];
    }
  }

  onStateSelected4() {
    var selectedState = this.locationForm4.controls['state'].value;

    if (selectedState) {
      this.filteredCities4 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities4.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities4 = [];
    }
  }

  onStateSelected5() {
    var selectedState = this.locationForm5.controls['state'].value;

    if (selectedState) {
      this.filteredCities5 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities5.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities5 = [];
    }
  }

  addLocation() {
    this.grpCounter++;
  }

  removeLocation() {
    this.grpCounter--;
    const forms = [null, this.locationForm2, this.locationForm3, this.locationForm4, this.locationForm5];
    const formToReset = forms[this.grpCounter];
    if (formToReset) {
      formToReset.reset();
    }
  }

  loadData(): void {
    if (this.sharedService.uniqueStates) {
      this.dataMccList = this.sharedService.dataMccList;
      this.filteredMCCList = this.dataMccList;
      this.filteredSponsorList = this.dataSponsorList;
      this.dataLocationList = this.sharedService.dataLocationList;
      this.dataSourceState = this.sharedService.uniqueStates;
      this.filteredStates1 = this.sharedService.uniqueStates;
      this.filteredStates2 = this.sharedService.uniqueStates;
      this.filteredStates3 = this.sharedService.uniqueStates;
      this.filteredStates4 = this.sharedService.uniqueStates;
      this.filteredStates5 = this.sharedService.uniqueStates;
    }
    else {
      this.pcbdcService.getMetaData("").subscribe((res) => {
        this.dataMccList = res.data.mccList;
        this.dataMccList.sort((a: any, b: any) => a.nameDescription.localeCompare(b.nameDescription));

        this.dataLocationList = res.data.locationList;

        const uniqueStates: Location[] = [];
        this.dataLocationList.forEach((current: Location) => {
          const x = uniqueStates.find(item => item.stateId === current.stateId);
          if (!x) {
            uniqueStates.push(current);
          }
        });

        uniqueStates.sort((a, b) => a.stateName.localeCompare(b.stateName));
        this.filteredMCCList = this.dataMccList;
        this.filteredSponsorList = this.dataSponsorList;
        this.dataSourceState = uniqueStates;
        this.filteredStates1 = uniqueStates;
        this.filteredStates2 = uniqueStates;
        this.filteredStates3 = uniqueStates;
        this.filteredStates4 = uniqueStates;
        this.filteredStates5 = uniqueStates;
        this.sharedService.setPcbdcMetaData(res.data, uniqueStates);
      })
    }
  }

  calculateTotal() {
    // Function to validate input and convert to number, handling NaN cases
    const validateInput = (input: number | string): number => {

      // Convert input to a float and check if it's NaN
      const parsedValue = parseFloat(input.toString());

      // If it's NaN, return 0; otherwise, return the parsed value
      return isNaN(parsedValue) ? 0 : parsedValue;
    };

    // Validate and get numeric values for denominations
    const fixedValue0_5 = validateInput(this.addForm.value.fixedValue0_5);
    const fixedValue1 = validateInput(this.addForm.value.fixedValue1);
    const fixedValue2 = validateInput(this.addForm.value.fixedValue2);
    const fixedValue5 = validateInput(this.addForm.value.fixedValue5);
    const fixedValue10 = validateInput(this.addForm.value.fixedValue10);
    const fixedValue20 = validateInput(this.addForm.value.fixedValue20);
    const fixedValue50 = validateInput(this.addForm.value.fixedValue50);
    const fixedValue100 = validateInput(this.addForm.value.fixedValue100);
    const fixedValue200 = validateInput(this.addForm.value.fixedValue200);
    const fixedValue500 = validateInput(this.addForm.value.fixedValue500);

    // Validate and get numeric values for counts
    const countfor0_5 = validateInput(this.addForm.value.countfor0_5);
    const countfor1 = validateInput(this.addForm.value.countfor1);
    const countfor2 = validateInput(this.addForm.value.countfor2);
    const countfor5 = validateInput(this.addForm.value.countfor5);
    const countfor10 = validateInput(this.addForm.value.countfor10);
    const countfor20 = validateInput(this.addForm.value.countfor20);
    const countfor50 = validateInput(this.addForm.value.countfor50);
    const countfor100 = validateInput(this.addForm.value.countfor100);
    const countfor200 = validateInput(this.addForm.value.countfor200);
    const countfor500 = validateInput(this.addForm.value.countfor500);

    // Calculate total by multiplying denominations with counts
    const total =
      fixedValue0_5 * countfor0_5 +
      fixedValue1 * countfor1 +
      fixedValue2 * countfor2 +
      fixedValue5 * countfor5 +
      fixedValue10 * countfor10 +
      fixedValue20 * countfor20 +
      fixedValue50 * countfor50 +
      fixedValue100 * countfor100 +
      fixedValue200 * countfor200 +
      fixedValue500 * countfor500;

    this.addForm.patchValue({ totalAmount: total }, { emitEvent: false });

    const totalQuantity0_5 = fixedValue0_5 * countfor0_5;
    this.addForm.patchValue({ totalQuantityAmount0_5: totalQuantity0_5 }, { emitEvent: false });

    const totalQuantity1 = fixedValue1 * countfor1;
    this.addForm.patchValue({ totalQuantityAmount1: totalQuantity1 }, { emitEvent: false });

    const totalQuantity2 = fixedValue2 * countfor2;
    this.addForm.patchValue({ totalQuantityAmount2: totalQuantity2 }, { emitEvent: false });

    const totalQuantity5 = fixedValue5 * countfor5;
    this.addForm.patchValue({ totalQuantityAmount5: totalQuantity5 }, { emitEvent: false });

    const totalQuantity10 = fixedValue10 * countfor10;
    this.addForm.patchValue({ totalQuantityAmount10: totalQuantity10 }, { emitEvent: false });

    const totalQuantity20 = fixedValue20 * countfor20;
    this.addForm.patchValue({ totalQuantityAmount20: totalQuantity20 }, { emitEvent: false });

    const totalQuantity50 = fixedValue50 * countfor50;
    this.addForm.patchValue({ totalQuantityAmount50: totalQuantity50 }, { emitEvent: false });

    const totalQuantity100 = fixedValue100 * countfor100;
    this.addForm.patchValue({ totalQuantityAmount100: totalQuantity100 }, { emitEvent: false });

    const totalQuantity200 = fixedValue200 * countfor200;
    this.addForm.patchValue({ totalQuantityAmount200: totalQuantity200 }, { emitEvent: false });

    const totalQuantity500 = fixedValue500 * countfor500;
    this.addForm.patchValue({ totalQuantityAmount500: totalQuantity500 }, { emitEvent: false });
  }

  showSponsorID(id: any) {
    this.isSponsorNameAvailable = true;
    const derivedSponsorId = this.filteredSponsorList.filter((sp: { id: any; }) => sp.id === id)[0].id
    this.addForm.patchValue({ sponsorId: derivedSponsorId }, { emitEvent: false })
  }

  save() {
    if (this.addForm.invalid) {
      this.toast.error("Please select mandatory fields.")
      return;
    }

    let obj: any = new Map();

    // Map denomination count only if count is greater than 0
    if (this.addForm.value.countfor0_5 > 0) {
      obj[this.addForm.value.fixedValue0_5] = this.addForm.value.countfor0_5;
    }
    if (this.addForm.value.countfor1 > 0) {
      obj[this.addForm.value.fixedValue1] = this.addForm.value.countfor1;
    }
    if (this.addForm.value.countfor2 > 0) {
      obj[this.addForm.value.fixedValue2] = this.addForm.value.countfor2;
    }
    if (this.addForm.value.countfor5 > 0) {
      obj[this.addForm.value.fixedValue5] = this.addForm.value.countfor5;
    }
    if (this.addForm.value.countfor10 > 0) {
      obj[this.addForm.value.fixedValue10] = this.addForm.value.countfor10;
    }
    if (this.addForm.value.countfor20 > 0) {
      obj[this.addForm.value.fixedValue20] = this.addForm.value.countfor20;
    }

    if (this.addForm.value.countfor50 > 0) {
      obj[this.addForm.value.fixedValue50] = this.addForm.value.countfor50;
    }
    if (this.addForm.value.countfor100 > 0) {
      obj[this.addForm.value.fixedValue100] = this.addForm.value.countfor100;
    }
    if (this.addForm.value.countfor200 > 0) {
      obj[this.addForm.value.fixedValue200] = this.addForm.value.countfor200;
    }
    if (this.addForm.value.countfor500 > 0) {
      obj[this.addForm.value.fixedValue500] = this.addForm.value.countfor500;
    }

    var isMccListAvailable = (this.selectedMCCList.length > 0) ? true : false;
    var isMccTextAvailable = !this.helper.isNullorUndefined(this.mccForm.get('mccTextCode')?.value);

    var isVPAAvailable = this.isFormDataAvailable(this.acceptanceForm, 'VPA') == '' ? false : true;
    var isWalletAvailable = this.isFormDataAvailable(this.acceptanceForm, 'WALLET') == '' ? false : true;
    var isState1Available = this.isStateDataValid(this.locationForm1, 'state');
    var isCity1Available = this.isCityDataValid(this.locationForm1, 'city', this.filteredCities1);
    var isBuff1Available = this.isFormDataAvailable(this.locationForm1, 'bufferZone') == null ? false : true;
    var isState2Available = this.isStateDataValid(this.locationForm2, 'state');
    var isCity2Available = this.isCityDataValid(this.locationForm2, 'city', this.filteredCities2);
    var isBuff2Available = this.isFormDataAvailable(this.locationForm2, 'bufferZone') == null ? false : true;
    var isState3Available = this.isStateDataValid(this.locationForm3, 'state');
    var isCity3Available = this.isCityDataValid(this.locationForm3, 'city', this.filteredCities3);
    var isBuff3Available = this.isFormDataAvailable(this.locationForm3, 'bufferZone') == null ? false : true;
    var isState4Available = this.isStateDataValid(this.locationForm4, 'state');
    var isCity4Available = this.isCityDataValid(this.locationForm4, 'city', this.filteredCities4);
    var isBuff4Available = this.isFormDataAvailable(this.locationForm4, 'bufferZone') == null ? false : true;
    var isState5Available = this.isStateDataValid(this.locationForm5, 'state');
    var isCity5Available = this.isCityDataValid(this.locationForm5, 'city', this.filteredCities5);
    var isBuff5Available = this.isFormDataAvailable(this.locationForm5, 'bufferZone') == null ? false : true;

    var forms = [this.locationForm1, this.locationForm2, this.locationForm3, this.locationForm4, this.locationForm5];

        if (this.selectedMCCList.length == 0 && this.mccForm.controls['mccListCode'].value) {
          this.toast.error("MCC is not selected.");
          this.mccForm.controls['mccListCode'].setValue(null);

          return;
        }

    if (!isMccListAvailable && !isMccTextAvailable && !isVPAAvailable && !isWalletAvailable && !isState1Available) {
      this.toast.error("Please select atleast one of the (MCC or Acceptance or Location) Details.")
      return;
    }

    if (this.selectedSponsorDetail.length == 0 && this.addForm.controls['sponsorName'].value) {
      this.toast.error("Sponsor must be selected from list.");
      return;
    }

    if (isState1Available && !isCity1Available) {
      this.toast.error("Please select city.")
      return;
    }

    if (isState1Available && isCity1Available && !isBuff1Available) {
      this.toast.error("Please enter bufferzone.")
      return;
    }

    if (isState2Available && !isCity2Available) {
      this.toast.error("Please select city.")
      return;
    }

    if (isState2Available && isCity2Available && !isBuff2Available) {
      this.toast.error("Please enter bufferzone.")
      return;
    }

    if (isState3Available && !isCity3Available) {
      this.toast.error("Please select city.")
      return;
    }

    if (isState3Available && isCity3Available && !isBuff3Available) {
      this.toast.error("Please enter bufferzone.")
      return;
    }

    if (isState4Available && !isCity4Available) {
      this.toast.error("Please select city.")
      return;
    }

    if (isState4Available && isCity4Available && !isBuff4Available) {
      this.toast.error("Please enter bufferzone.")
      return;
    }

    if (isState5Available && !isCity5Available) {
      this.toast.error("Please select city.")
      return;
    }

    else if (isState5Available && isCity5Available && !isBuff5Available) {
      this.toast.error("Please enter bufferzone.")
      return;
    }

    for (const form of forms) {
      if (form.get('bufferZone')?.status == 'INVALID') {
        this.toast.error("Radius must be in between 50 to 100");
        return;
      }
    }

    if (this.addForm.value.totalAmount === 0) {
      this.toast.error("Please enter atleast one demomination.")
      return;
    }

    // check the location equality here.
    var state1 = this.locationForm1.value
    var state2 = this.locationForm2.value
    var state3 = this.locationForm3.value
    var state4 = this.locationForm4.value
    var state5 = this.locationForm5.value

    var locationDuplicate = true;

    if (isState1Available) {

      if (isState2Available) {
        if (isEqual(state1, state2)) {
          locationDuplicate = false;
        }
      }
      if (isState3Available) {
        if (isEqual(state1, state3) || isEqual(state2, state3)) {
          locationDuplicate = false;
        }
      }
      if (isState4Available) {
        if (isEqual(state1, state4) || isEqual(state2, state4) || isEqual(state3, state4)) {
          locationDuplicate = false;
        }
      }
      if (isState5Available) {
        if (isEqual(state1, state5) || isEqual(state2, state5) || isEqual(state3, state5) || isEqual(state4, state5)) {
          locationDuplicate = false;
        }
      }
      if (!locationDuplicate) {
        this.toast.error("Location combination is duplicate, Please check!.")
        return;
      }
    }

    let mccListString = this.selectedMCCList.map((mcc: any) => `${mcc}`).join(',');
    let mccTextString = this.mccForm.value.mccTextCode;

    let mccString = '';

    if (mccListString && mccListString.length > 0 && mccTextString && mccTextString.length > 0) {
      this.toast.error('Any one of the MCC field must be filled');
      return;
    }

    // Trim comma, if comma exist at first place of a string
    if (mccTextString?.indexOf(',') == 0) {
      mccTextString = mccTextString?.substring(1, mccTextString?.length);
    }

    // Trim comma, if comma exist at last place of a string
    if (mccTextString?.lastIndexOf(',') + 1 == mccTextString?.length) {
      mccTextString = mccTextString?.substring(0, mccTextString.lastIndexOf(','));
    }

    let dupeMcc = this.checkDupeMcc(mccTextString);

    if (dupeMcc) {
      this.toast.error(dupeMcc + '  is duplicate');
      return;
    }

    if (!this.validateMcc(mccTextString) && this.mccForm.controls['mccTextCode']?.value) {
      this.toast.error('Bulk MCC List does not have valid MCC(s)');
      return;
    }

    if (mccListString && mccListString.length > 0) {
      mccString = mccListString;
    } else if (mccTextString && mccTextString.length > 0) {
      mccString = mccTextString;
    }

    // const langString = this.selectedLanguageList.map((lang: any) => `${lang}`).join(',');
    const vpa = this.acceptanceForm.get('VPA')?.value;
    const wallet = this.acceptanceForm.get('WALLET')?.value;

    var arrayVpa: any[] = [];
    var arrayWallet: any[] = [];

    vpa?.trim().split(',').forEach((e: any) => {
      arrayVpa.push(e);
    })

    wallet?.trim().split(',').forEach((e: any) => {
      arrayWallet.push(e);
    })

    var acceptanceType: any = {}
    if (vpa !== '')
      acceptanceType.VPA = arrayVpa;
    if (wallet !== '')
      acceptanceType.WALLET = arrayWallet;

    var multiStateFormArray = [];
    if (isState1Available)
      multiStateFormArray.push(this.locationForm1.value);
    if (isState2Available)
      multiStateFormArray.push(this.locationForm2.value);
    if (isState3Available)
      multiStateFormArray.push(this.locationForm3.value);
    if (isState4Available)
      multiStateFormArray.push(this.locationForm4.value);
    if (isState5Available)
      multiStateFormArray.push(this.locationForm5.value);

    forms.forEach((form) => {
      if (form.valid) {
        var formData = form.value;
        var newCityId = this.dataLocationList.find(city => city.cityName === formData.city);
        if (newCityId) {
          formData.city = newCityId.cityId;
          formData.state = newCityId.stateId;
        }
      }
    });

    let request = {
      "denominations": obj,
      "amount": this.addForm.value.totalAmount,
      "mcc": mccString,
      location: multiStateFormArray,
      "expiry": this.datePipe.transform(this.addForm.value.expiry, 'dd-MM-yyyy'),
      "sponsorName": this.addForm.value.sponsorName,
      "sponsorId": this.addForm.value.sponsorId,
      acceptance: acceptanceType,
      authBy: this.addForm.value.authType,
    }

    this.pcbdcService.addRule(request).subscribe(
      data => {
        if (data && data.success) {
          this.userService.reloadCurrentRoute();
        }
        else {
          this.toast.error(data && data.message);
        }
      },);
  }

  validateMcc(mccString1: string): boolean {
    let isValid: boolean = true;
    let mccStringArry: string[] = mccString1?.trim().split(',');

    for (let i: number = 0; i < mccStringArry?.length; i++) {
      let x = this.dataMccList.findIndex((mcc: any) => mcc.nameDescription.toLowerCase() == (mccStringArry[i].toLowerCase()));
      if (x < 0) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }

  checkDupeMcc(mccString: string): string {
    let outerMCCStringArry: string[] = mccString?.trim().split(',');
    let innerMCCStringArry: string[] = mccString?.trim().split(',');

    let dupeEntry = '';
    for (let i: number = 0; i < outerMCCStringArry?.length; i++) {
      for (let j: number = i + 1; j < innerMCCStringArry?.length; j++) {
        if (innerMCCStringArry[j] == outerMCCStringArry[i]) {
          dupeEntry = innerMCCStringArry[j];
          break;
        }
      }
    }
    return dupeEntry;
  }

  isFormDataAvailable(fb: FormGroup, controlName: string) {
    return fb.get(controlName)?.value
  }

  isStateDataValid(fb: FormGroup, controlName: string) {
    var selectedState = fb.get(controlName)?.value;
    var isStateSelected = this.dataSourceState.findIndex((state: any) => state.stateName.toUpperCase() == selectedState);
    return isStateSelected >= 0;
  }

  isCityDataValid(fb: FormGroup, controlName: string, filteredCities: City[]) {
    var selectedCity = fb.get(controlName)?.value;
    var isCitySelected = filteredCities.findIndex((city: any) => city.cityName == selectedCity);
    return isCitySelected >= 0;
  }

  resetForm() {
    for (let value in this.addForm.controls) {
      this.addForm.controls[value].setValue('');
      this.addForm.controls[value].setErrors(null);
    }
  }

  onClose() {
    this.scrollToElement();
    setTimeout(() => {
      this.userService.reloadCurrentRoute();
    }, 500);
  }

  scrollToElement(): void {
    const element = this.targetElement.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        top: 0,
      });
    }
  }
}
