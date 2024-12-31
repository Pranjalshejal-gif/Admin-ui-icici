import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { HelperService } from 'src/app/Services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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

export interface MCC {
  mcc: string;
}

export interface City {
  cityId: string;
  cityName: string;
}

@Component({
  selector: 'app-update-rule',
  templateUrl: './update-rule.component.html',
  styleUrls: ['./update-rule.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: HelperService.MY_FORMATS }]
})

export class UpdateRuleComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<MCC>;
  @ViewChild('mccInput') mccInput: ElementRef<HTMLInputElement>;
  @ViewChild('langInput') langInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  editForm: FormGroup;
  mccForm: FormGroup = this.fb.group({
    mccListDetails: [null],
    mccTextDetails: [null]
  });
  acceptanceForm: FormGroup = this.fb.group({
    VPA: [''],
    WALLET: ['']
  });
  locationForm1: FormGroup = this.fb.group({
    city: [null],
    state: [null],
    bufferZone: ['', [Validators.pattern(/^(100|[5-9][\d]{1})$/)]]
  })
  locationForm2: FormGroup = this.fb.group({
    city: [null],
    state: [null],
    bufferZone: ['', [Validators.pattern(/^(100|[5-9][\d]{1})$/)]]
  });
  locationForm3: FormGroup = this.fb.group({
    city: [null],
    state: [null],
    bufferZone: ['', [Validators.pattern(/^(100|[5-9][\d]{1})$/)]]
  });
  locationForm4: FormGroup = this.fb.group({
    city: [null],
    state: [null],
    bufferZone: ['', [Validators.pattern(/^(100|[5-9][\d]{1})$/)]]
  });
  locationForm5: FormGroup = this.fb.group({
    city: [null],
    state: [null],
    bufferZone: ['', [Validators.pattern(/^(100|[5-9][\d]{1})$/)]]
  });
  ruleDetails: any;
  derivedSponsorId: any;
  dataSourceMcc = [];
  dataCities: any[] = [];
  dataSourceState: any[] = [];
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
  filteredMCCList: any[] = [];
  selectedMCCList: any[] = [];
  selectedState: any[] = [];
  selectedCity: any[] = [];
  selectedCity1: any[] = [];
  dataMccList: any = [];
  dataLocationList: any[] = [];
  dataSponsorList: any = [];
  map = new Map<string, any>();
  minDateToFinish = new Subject<string>();
  minDate: Date;
  today = new Date();
  grpCounter: number = 1;
  isSponsorNameAvailable = false;
  showEditForm: boolean = false;
  radiusRegEx = Validators.pattern(/^(100|[5-9][\d]{1})$/);
  dateChange(e: { value: { toString: () => string; }; }) {
    this.minDateToFinish.next(e.value.toString());
  }

  constructor(private router: Router,
    private fb: FormBuilder, private toast: ToastrService, private pcbdcService: PcbdcService,
    private userService: UserService, private datePipe: DatePipe, private sharedService: SharedService,
    private helper: HelperService
  ) {
    this.minDateToFinish.subscribe(r => {
      this.minDate = new Date(r);
    })
    this.ruleDetails = this.router.getCurrentNavigation()?.extras;
  }

  ngOnInit(): void {

    this.userService.showSpinner();
    this.loadData();

    // Set a time delay to ensure that the edit form has loaded data before proceeding.
    setTimeout(() => {

      this.pcbdcService.getSponsor().subscribe((res) => {
        this.dataSponsorList = res.data;
        this.dataSponsorList.sort((a: any, b: any) => { return a.name.localeCompare(b.name) })
      })

      this.editForm = this.fb.group({
        ruleId: this.ruleDetails.ruleId,
        sponsorName: [this.ruleDetails.sponsorName, Validators.required],
        sponsorId: this.ruleDetails.sponsorId,
        expiry: [new Date(this.ruleDetails.expiryTimestamp), Validators.required],
        authType: [this.ruleDetails.authBy, Validators.required],
      });

      this.mccForm = this.fb.group({
        mccListDetails: [this.selectedMCCList],
        mccTextDetails: mccTextDetailsArray
      })

      const existingMccLength = this.ruleDetails.mccDetails?.split(',').length;

      // MCC //
      if (this.ruleDetails.mccDetails != null) {
        if (existingMccLength < 10) {
          const mccListDetailsArray = this.ruleDetails.mccDetails.split(',');
          this.selectedMCCList = mccListDetailsArray;
          this.mccForm.controls['mccTextDetails'].setValue(null);
          this.mccForm.controls['mccListDetails'].setValue(this.selectedMCCList);
        } else {
          var mccTextDetailsArray = this.ruleDetails.mccDetails;
          this.mccForm.controls['mccListDetails'].setValue(null);
          this.mccForm.controls['mccTextDetails'].setValue(mccTextDetailsArray);
        }
      }
      // If mcc is not available
      else {
        this.mccForm.controls['mccListDetails'].setValue(null);
        this.mccForm.controls['mccTextDetails'].setValue(null);
      }
      // Acceptance Details //
      const acceptanceDetails = JSON.parse(this.ruleDetails.acceptanceDetails);

      if (acceptanceDetails) {
        var vpaValue = '';
        var walletValue = '';
        if (Array.isArray(acceptanceDetails.VPA)) {
          const vpaArray = acceptanceDetails.VPA;
          vpaValue = vpaArray.join(',');
        }
        if (Array.isArray(acceptanceDetails.WALLET)) {
          const walletArray = acceptanceDetails.WALLET;
          walletValue = walletArray.join(',');
        }

        this.acceptanceForm = this.fb.group({
          VPA: [vpaValue, [Validators.pattern(/^(\w+@[a-zA-Z0-9.]+)(,\w+@[a-zA-Z0-9.]+)*$/)]],
          WALLET: [walletValue, [Validators.pattern(/^[a-zA-Z0-9,]+$/), Validators.minLength(10), Validators.maxLength(100)]],
        });
      }

      // Location //
      const locationDetails = JSON.parse(this.ruleDetails.locationDetails);

      this.grpCounter = locationDetails.length;

      if (locationDetails[0]) {
        const stateLocationDetails1 = locationDetails[0].state;
        const cityLocationDetails1 = locationDetails[0].city;
        const state1 = this.filteredStates1.find(item => item.stateId === stateLocationDetails1);
        const bufferZoneValues1 = locationDetails[0].bufferZone;

        if (state1) {
          const stateId1 = state1.stateId;
          const citiesForState1 = this.dataLocationList.filter(city => city.stateId === stateId1);
          this.filteredCities1 = citiesForState1;

          if (citiesForState1.length > 0) {
            const selectedCity1 = citiesForState1.find(city => city.cityId === cityLocationDetails1);
            this.locationForm1 = this.fb.group({
              city: [selectedCity1?.cityName],
              state: [state1.stateName],
              bufferZone: [bufferZoneValues1, this.radiusRegEx]
            });
          }
        }
      }

      if (locationDetails[1]) {
        const stateLocationDetails2 = locationDetails[1].state;
        const cityLocationDetails2 = locationDetails[1].city;
        const state2 = this.filteredStates2.find(item => item.stateId === stateLocationDetails2);
        const bufferZoneValues2 = locationDetails[1].bufferZone;

        if (state2) {
          const stateId2 = state2.stateId;
          const citiesForState2 = this.dataLocationList.filter(city => city.stateId === stateId2);
          this.filteredCities2 = citiesForState2;

          if (citiesForState2.length > 0) {
            const selectedCity2 = citiesForState2.find(city => city.cityId === cityLocationDetails2);
            this.locationForm2 = this.fb.group({
              city: [selectedCity2?.cityName],
              state: [state2.stateName],
              bufferZone: [bufferZoneValues2, this.radiusRegEx]
            });
          }
        }
      }

      if (locationDetails[2]) {
        const stateLocationDetails3 = locationDetails[2].state;
        const cityLocationDetails3 = locationDetails[2].city;
        const state3 = this.filteredStates3.find(item => item.stateId === stateLocationDetails3);
        const bufferZoneValues3 = locationDetails[2].bufferZone;

        if (state3) {
          const stateId3 = state3.stateId;
          const citiesForState3 = this.dataLocationList.filter(city => city.stateId === stateId3);
          this.filteredCities3 = citiesForState3;

          if (citiesForState3.length > 0) {
            const selectedCity3 = citiesForState3.find(city => city.cityId === cityLocationDetails3);

            this.locationForm3 = this.fb.group({
              city: [selectedCity3?.cityName],
              state: [state3.stateName],
              bufferZone: [bufferZoneValues3, this.radiusRegEx]
            });
          }
        }
      }

      if (locationDetails[3]) {
        const stateLocationDetails4 = locationDetails[3].state;
        const cityLocationDetails4 = locationDetails[3].city;
        const state4 = this.filteredStates4.find(item => item.stateId === stateLocationDetails4);
        const bufferZoneValues4 = locationDetails[3].bufferZone;

        if (state4) {
          const stateId4 = state4.stateId;
          const citiesForState4 = this.dataLocationList.filter(city => city.stateId === stateId4);
          this.filteredCities4 = citiesForState4;

          if (citiesForState4.length > 0) {
            const selectedCity4 = citiesForState4.find(city => city.cityId === cityLocationDetails4);

            this.locationForm4 = this.fb.group({
              city: [selectedCity4?.cityName],
              state: [state4.stateName],
              bufferZone: [bufferZoneValues4, this.radiusRegEx]
            });
          }
        }
      }

      if (locationDetails[4]) {
        const stateLocationDetails5 = locationDetails[4].state;
        const cityLocationDetails5 = locationDetails[4].city;
        const state5 = this.filteredStates5.find(item => item.stateId === stateLocationDetails5);
        const bufferZoneValues5 = locationDetails[4].bufferZone;

        if (state5) {
          const stateId5 = state5.stateId;
          const citiesForState5 = this.dataLocationList.filter(city => city.stateId === stateId5);
          this.filteredCities5 = citiesForState5;

          if (citiesForState5.length > 0) {
            const selectedCity5 = citiesForState5.find(city => city.cityId === cityLocationDetails5);

            this.locationForm5 = this.fb.group({
              city: [selectedCity5?.cityName],
              state: [state5.stateName],
              bufferZone: [bufferZoneValues5, this.radiusRegEx]
            });
          }
        }
      }
      this.showEditForm = true;
    }, 1000);
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
      if (this.selectedMCCList.length == 0) {
        this.mccForm.controls['mccListDetails'].setValue(null);
      }
    }
  }

  onSelectMCC() {
    var selectedMCC = this.mccForm.controls['mccListDetails'].value;
    this.filteredMCCList = this.dataMccList.filter((mcc: any) => mcc.nameDescription.toLowerCase().includes(selectedMCC.toLowerCase()));
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
    locationForm.get('bufferZone')?.setValue('');
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
    var selectedState = this.locationForm1.controls['state'].value
    if (selectedState) {
      this.filteredCities1 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities1.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
  }

  onStateSelected2() {
    var selectedState = this.locationForm2.controls['state'].value
    if (selectedState) {
      this.filteredCities2 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities2.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities2 = [];
    }
  }

  onStateSelected3() {
    var selectedState = this.locationForm3.controls['state'].value
    if (selectedState) {
      this.filteredCities3 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities3.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities2 = [];
    }
  }

  onStateSelected4() {
    var selectedState = this.locationForm4.controls['state'].value
    if (selectedState) {
      this.filteredCities4 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities4.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities2 = [];
    }
  }

  onStateSelected5() {
    var selectedState = this.locationForm5.controls['state'].value
    if (selectedState) {
      this.filteredCities5 = this.dataLocationList.filter(city => city.stateName.toUpperCase() === selectedState);
      this.filteredCities5.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }
    else {
      this.filteredCities2 = [];
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

  submit() {
    if (this.editForm.invalid) {
      this.toast.error("Please select mandatory fields.")
      return;
    }
    var isMccListAvailable = (this.selectedMCCList.length > 0) ? true : false;
    var isMccTextAvailable = !this.helper.isNullorUndefined(this.mccForm.get('mccTextDetails')?.value);

    var isVPAAvailable = this.isFormDataAvailable(this.acceptanceForm, 'VPA') == '' ? false : true;
    var isWalletAvailable = this.isFormDataAvailable(this.acceptanceForm, 'WALLET') == '' ? false : true;

    var isState1Available = this.isStateDataValid(this.locationForm1, 'state');
    var isCity1Available = this.isCityDataValid(this.locationForm1, 'city', this.filteredCities1);
    var isBuff1Available = this.isFormDataAvailable(this.locationForm1, 'bufferZone') == '' ? false : true;
    var isState2Available = this.isStateDataValid(this.locationForm2, 'state');
    var isCity2Available = this.isCityDataValid(this.locationForm2, 'city', this.filteredCities2);
    var isBuff2Available = this.isFormDataAvailable(this.locationForm2, 'bufferZone') == '' ? false : true;
    var isState3Available = this.isStateDataValid(this.locationForm3, 'state');
    var isCity3Available = this.isCityDataValid(this.locationForm3, 'city', this.filteredCities3);
    var isBuff3Available = this.isFormDataAvailable(this.locationForm3, 'bufferZone') == '' ? false : true;
    var isState4Available = this.isStateDataValid(this.locationForm4, 'state');
    var isCity4Available = this.isCityDataValid(this.locationForm4, 'city', this.filteredCities4);
    var isBuff4Available = this.isFormDataAvailable(this.locationForm4, 'bufferZone') == '' ? false : true;
    var isState5Available = this.isStateDataValid(this.locationForm5, 'state');
    var isCity5Available = this.isCityDataValid(this.locationForm5, 'city', this.filteredCities5);
    var isBuff5Available = this.isFormDataAvailable(this.locationForm5, 'bufferZone') == '' ? false : true;

    var forms = [this.locationForm1, this.locationForm2, this.locationForm3, this.locationForm4, this.locationForm5];

    if (this.selectedMCCList.length == 0 && this.mccForm.controls['mccListDetails']?.value) {
      this.toast.error("MCC is not selected.");
      return;
    }

    if (!isMccListAvailable && !isMccTextAvailable && !isVPAAvailable && !isWalletAvailable && !isState1Available) {
      this.toast.error("Please select atleast one of the (MCC or Acceptance or Location) Details.")
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
    let mccTextString = this.mccForm.value?.mccTextDetails;

    let mccString = '';

    if (mccListString && mccListString.length > 0 && mccTextString && mccTextString.length > 0) {
      this.toast.error('Either one of the MCC fields must be filled');
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

    if (!this.validateMcc(mccTextString) && this.mccForm.controls['mccTextDetails']?.value) {
      this.toast.error('Bulk MCC List does not have valid MCC(s)');
      return;
    }

    if (mccListString && mccListString.length > 0) {
      mccString = mccListString;
    } else if (mccTextString && mccTextString.length > 0) {
      mccString = mccTextString;
    }

    const vpa = this.acceptanceForm.get('VPA')?.value
    const wallet = this.acceptanceForm.get('WALLET')?.value

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

    var multiStateFormArray2: any[] = [];
    if (isState1Available)
      multiStateFormArray2.push(this.locationForm1.value);
    if (isState2Available)
      multiStateFormArray2.push(this.locationForm2.value);
    if (isState3Available)
      multiStateFormArray2.push(this.locationForm3.value);
    if (isState4Available)
      multiStateFormArray2.push(this.locationForm4.value);
    if (isState5Available)
      multiStateFormArray2.push(this.locationForm5.value);

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
      "id": this.ruleDetails.id,
      "ruleId": this.ruleDetails.ruleId,
      "expiry": this.datePipe.transform(this.editForm.value.expiry, 'dd-MM-yyyy'),
      authBy: this.editForm.value.authType,
      "mcc": mccString,
      acceptance: acceptanceType,
      location: multiStateFormArray2,
    }

    this.pcbdcService.editRule(request).subscribe(
      data => {
        if (data && data.success) {
          this.router.navigate([`pcbdc-management/sponsor-rule-search`])
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
    var x = fb.get(controlName)?.value;

    return x;
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

  back() {
    this.router.navigate([`pcbdc-management/sponsor-rule-search`])
  }
}
