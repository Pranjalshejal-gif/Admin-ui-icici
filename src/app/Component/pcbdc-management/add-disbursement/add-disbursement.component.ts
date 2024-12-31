import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MerchantData } from 'src/app/models/merchantData';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from 'src/app/Services/shared.service';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { DisbursementFileUploadDialogComponent } from './disbursement-file-upload-dialog/disbursement-file-upload-dialog.component';
import { HelperService } from 'src/app/Services/helper.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
export class LocationArray {
  stateName: string;
  cityName: string;
  bufferZone: number;

  constructor(stateName: string, cityName: string, bufferZone: number) {
    this.stateName = stateName;
    this.cityName = cityName;
    this.bufferZone = bufferZone;
  }
}
@Component({
  selector: 'app-add-disbursement',
  templateUrl: './add-disbursement.component.html',
  styleUrls: ['./add-disbursement.component.scss']
})
export class AddDisbursementComponent implements OnInit {

  @ViewChild('sponsorInput') sponsorInput: ElementRef<HTMLInputElement>;

  addForm: FormGroup;
  sponsorsList: any = [];
  ruleIdList: any = {};
  programTokenList: any = [];
  data: any;
  isDataAvailable = false;
  isProgramTokenAvailable = false;
  isData = false;
  file: File;
  excelData: MerchantData[] = [];
  fileData: MatTableDataSource<any>;
  customer: any = {};
  ruleMcc: string;
  ruleAuthBy: string;
  ruleMccDescription: string;
  ruleTimeStamp: string;
  ruleVpa: string;
  ruleWallet: string;
  //this is the denomination variable
  fixedValue0: number = 0.5
  fixedValue1: number = 1
  fixedValue2: number = 2
  fixedValue5: number = 5
  fixedValue10: number = 10
  fixedValue20: number = 20
  fixedValue50: number = 50
  fixedValue100: number = 100
  fixedValue200: number = 200
  fixedValue500: number = 500
  fixedValue2000: number = 2000

  foundCity: any;
  foundState: any;
  dataLocationList: any[];
  locationUIArray: LocationArray[] = [];
  dataSponsorList: any = [];
  filteredSponsorList: any = [];
  selectedSponsorDetail: any[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    public datepipe: DatePipe,
    private pcbdcService: PcbdcService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private sharedService: SharedService, private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.isProgramTokenAvailable = false;
    this.addForm = this.fb.group({
      sponsorName: ['', Validators.required],
      sponsorId: ['', Validators.required],
      ruleId: ['', Validators.required],
      totalAmount: [],
      countfor0: [],
      countfor1: [],
      countfor2: [],
      countfor5: [],
      countfor10: [],
      countfor20: [],
      countfor50: [],
      countfor100: [],
      countfor200: [],
      countfor500: [],
      countfor2000: [],
    });
    if (this.sharedService.dataLocationList) {
      this.dataLocationList = this.sharedService.dataLocationList;
      this.filteredSponsorList = this.sponsorsList;
    }
    else {
      this.pcbdcService.getMetaData("").subscribe((res) => {
        this.dataLocationList = res.data.locationList;

        this.filteredSponsorList = this.sponsorsList;
        this.sharedService.setPcbdcMccMetaData(res.data);
      })
    }
    this.pcbdcService.getSponsor().subscribe((res) => {
      if (res && res.data) {
        this.sponsorsList = res.data;
        this.sponsorsList.sort((a: any, b: any) => { return a.name.localeCompare(b.name) })
        this.filteredSponsorList = this.sponsorsList;
      }
      else {
        this.toast.error(res.message)
      }
    })
  }
  onSponsorType() {
    var selectedSponsorDetail = this.addForm.controls['sponsorName'].value;
    this.filteredSponsorList = this.sponsorsList.filter((sponsor: any) => {
      return sponsor.name.toLowerCase().includes(selectedSponsorDetail.toLowerCase()) ||
        sponsor.id.toString().toLowerCase().includes(selectedSponsorDetail.toLowerCase());
    });
  }

  selectedSponsor(event: MatAutocompleteSelectedEvent): void {
    this.isDataAvailable = true;
    var sponsor = event.option.value;
    this.selectedSponsorDetail.push(sponsor);
    this.filteredSponsorList = this.sponsorsList;
    this.isDataAvailable = true;

  }
  showData(id: any) {
    this.isDataAvailable = false;
    this.isProgramTokenAvailable = false;

    const derivedSponsorId = this.filteredSponsorList.filter((sp: { id: any; }) => sp.id === id)[0].id
    this.addForm.patchValue({ sponsorId: derivedSponsorId }, { emitEvent: false })
    let request = {
      id: this.addForm.value.sponsorId
    }
    this.pcbdcService.getRuleId(request).subscribe(res => {
      if (res && res.data) {
        this.ruleIdList = res?.data;
        this.isDataAvailable = true;
      }
      else {
        this.toast.error('No Rules found for this Sponsor');
        this.isDataAvailable = false;
      }
    })
  };

  showProgramToken(rule: any) {
    this.locationUIArray = [];
    this.ruleMcc = rule?.mccDetails;
    this.ruleAuthBy = rule?.authBy;
    this.ruleTimeStamp = this.transformDate(rule?.expiryTimestamp);
    var acceptance = JSON.parse(rule.acceptanceDetails);
    this.ruleVpa = acceptance?.VPA;
    this.ruleWallet = acceptance?.WALLET;
    var locations = JSON.parse(rule?.locationDetails) as any[];

    locations.forEach((x) => {
      var foundCity = this.dataLocationList.find(city => city.cityId === x.city);
      if (foundCity) {
        this.locationUIArray.push(new LocationArray(foundCity?.stateName, foundCity?.cityName, x.bufferZone))
      }
    });

    let request =
    {
      "ruleId": this.addForm.value.ruleId
    }
    this.pcbdcService.getAllProgramToken(request).subscribe(res => {
      if (res && res.data) {
        this.programTokenList = res.data.tokenAvailability;
        this.isProgramTokenAvailable = true;
        this.calculateTotal();
      }
      else {
        this.toast.error(res.message)
      }
    })
  }

  transformDate(timestamp: string): string {
    const date = new Date(timestamp);
    return this.datepipe.transform(date, 'dd-MM-yyyy') || '';
  }

  calculateTotal() {
    // Validate and get numeric values for denominations
    const fixedValue0 = 0.5;
    const fixedValue1 = 1;
    const fixedValue2 = 2;
    const fixedValue5 = 5;
    const fixedValue10 = 10;
    const fixedValue20 = 20;
    const fixedValue50 = 50;
    const fixedValue100 = 100;
    const fixedValue200 = 200;
    const fixedValue500 = 500;
    const fixedValue2000 = 2000;

    // Validate and get numeric values for counts
    const countfor0 = this.programTokenList["50"];
    const countfor1 = this.programTokenList["100"];
    const countfor2 = this.programTokenList["200"];
    const countfor5 = this.programTokenList["500"];
    const countfor10 = this.programTokenList["1000"];
    const countfor20 = this.programTokenList["2000"];
    const countfor50 = this.programTokenList["5000"];
    const countfor100 = this.programTokenList["10000"];
    const countfor200 = this.programTokenList["20000"];
    const countfor500 = this.programTokenList["50000"];
    const countfor2000 = this.programTokenList["200000"];

    // Calculate total by multiplying denominations with counts
    const total =
      fixedValue0 * countfor0 +
      fixedValue1 * countfor1 +
      fixedValue2 * countfor2 +
      fixedValue5 * countfor5 +
      fixedValue10 * countfor10 +
      fixedValue20 * countfor20 +
      fixedValue50 * countfor50 +
      fixedValue100 * countfor100 +
      fixedValue200 * countfor200 +
      fixedValue500 * countfor500 +
      fixedValue2000 * countfor2000
    this.addForm.patchValue({ totalAmount: total }, { emitEvent: false });
  }

  upload() {
    this.sharedService.setIds(this.addForm.value.sponsorId, this.addForm.value.ruleId);
    this.pcbdcService.uploadPcbdcFileAndData(this.file).subscribe(
      res => {
        if (res && res.success) {
          const dialogRef = this.dialog.open(DisbursementFileUploadDialogComponent, {
            width: '60%',
            data: { "fileDetails": res },
            autoFocus: false,
            maxHeight: '400px'
          });
        }
        else
          this.toast.error(res.msg);
      }, err => {
        console.log(err);
      });
  }

  readFile(event: any) {
    this.file = event.target.files[0];
  }
  getPcbdcBulkUpload() {
    let flag = 'pcbdc-bulk-upload';
    this.helperService.getFileTemplateAndSave(flag);

  }
}
