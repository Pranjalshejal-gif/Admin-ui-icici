import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-sponsor-rule-search',
  templateUrl: './sponsor-rule-search.component.html',
  styleUrls: ['./sponsor-rule-search.component.scss']
})

export class SponsorRuleSearchComponent implements OnInit {

  @ViewChild('sponsorInput') sponsorInput: ElementRef<HTMLInputElement>;
  searchForm: FormGroup;
  dataSponsorList: any = [];
  filteredSponsorList: any[] = [];
  atLeastOneRequired: boolean = true;
  showData: boolean = false;
  dataSourceSponsor: MatTableDataSource<any>;
  Columns: string[];
  selectedSponsorDetail: any[] = [];

  constructor(private fb: FormBuilder, private pcbdcService: PcbdcService,
    private toast: ToastrService, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.Columns = this.pcbdcService.ruleSearchColumns;

    this.searchForm = this.fb.group({
      sponsorId: ['']
    })
    this.loadData();
  }

  loadData(): void {
    this.pcbdcService.getSponsor().subscribe((res) => {
      this.dataSponsorList = res.data;
      this.dataSponsorList.sort((a: any, b: any) => { return a.name.localeCompare(b.name) })
      this.filteredSponsorList = this.dataSponsorList;
    })
  }

  onSponsorType() {
    var selectedSponsorDetail = this.searchForm.controls['sponsorId'].value;
    this.filteredSponsorList = this.dataSponsorList.filter((sponsor: any) => {
      return sponsor.name.toLowerCase().includes(selectedSponsorDetail.toLowerCase()) ||
        sponsor.id.toString().toLowerCase().includes(selectedSponsorDetail.toLowerCase());
    });
  }

  selectedSponsor(event: MatAutocompleteSelectedEvent): void {

    var sponsor = event.option.value;

    const index = this.selectedSponsorDetail.indexOf(sponsor);

    if (index >= 0) {
      this.sponsorInput.nativeElement.value = '';
      this.toast.error('Selected entry already exisits');
      return;
    }

    this.selectedSponsorDetail.push(sponsor);
    this.sponsorInput.nativeElement.disabled = true;
    this.filteredSponsorList = this.dataSponsorList;
  }

  search() {
    let valid = this.searchForm;

    if (isNullorUndefined(valid.get('sponsorId')?.value)) {
      this.atLeastOneRequired = false;
      this.toast.error("Search criteria is required");
      return;
    }

    if (this.selectedSponsorDetail.length == 0 && this.searchForm.controls['sponsorId'].value) {
      this.toast.error("Sponsor must be selected from list.");
      return;
    }

    else {
      let request = {
        id: this.searchForm.value.sponsorId,
      }

      this.pcbdcService.ruleSearch(request).subscribe(res => {
        if (res && res.success) {
          var arr = res.data;
          arr.forEach((obj: any) => {
            obj.status = obj.status === "P" ? 'PENDING' :
              obj.status === "C" ? 'COMPLETED' :
                obj.status === "R" ? 'INVALID' :
                  obj.status === "I" ? 'IN_PROGRESS' :
                    obj.status === "Y" ? 'APPROVED' :
                      obj.status === "X" ? 'REJECTED' :
                        '';
          });
          this.dataSourceSponsor = new MatTableDataSource(res.data);
          this.atLeastOneRequired = true;
          this.showData = true;
        }
        else {
          this.showData = false;
          this.toast.error("No Matching record found");
        }
      });
    }
  }

  enhance(id: any) {
    this.router.navigate([`pcbdc-management/sponsor-rule-search/update-rule`], this.dataSourceSponsor.filteredData.find(r => r.id == id));
  }

  topUp(id: any) {
    this.router.navigate([`pcbdc-management/sponsor-rule-search/update-rule-denomination`], this.dataSourceSponsor.filteredData.find(r => r.id == id));
  }

  cancel() {
    this.userService.reloadCurrentRoute();
  }
}

function isNullorUndefined(val: any) {
  if (val == undefined)
    return true;
  if (val == '')
    return true;
  if (val == null)
    return true;
  return false;
}
