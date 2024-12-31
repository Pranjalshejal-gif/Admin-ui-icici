import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { UserManagementService } from 'src/app/Services/user-management.service';
import { Router } from '@angular/router';
import { AddRcLocalDialogComponent } from 'src/app/Component/rc-management/add-rc-local-dialog/add-rc-local-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ApproveRefundPayoutService } from 'src/app/Services/approve-refund-payout.service';
import { UpdateRcLocalComponent } from 'src/app/Component/rc-management/update-rc-local/update-rc-local.component';
import { ApprejDialogComponent } from 'src/app/Component/cashback/approve-refund-payout/apprej-dialog/apprej-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { RefundPayoutService } from 'src/app/Services/refund-payout.service';
import * as FileSaver from 'file-saver';
import { LoadDialogComponent } from 'src/app/Component/cashback/load/cashbackload/load-dialog/load-dialog.component';
import { AutoReconService } from 'src/app/Services/auto-recon.service';
import { UpdateBlacklistCustomerComponent } from 'src/app/Component/blacklist-customer/search-blacklist-customer/update-blacklist-customer/update-blacklist-customer.component';
import { ApproveRejectBlacklistCustomerComponent } from 'src/app/Component/blacklist-customer/approve-reject-blacklist-customer/approve-reject-blacklist-customer.component';
import { BlacklistCustomerService } from 'src/app/Services/blacklist-customer.service';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { DatePipe } from '@angular/common';
import { HelperService } from 'src/app/Services/helper.service';
import { Constants } from '../constants';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  selection = new SelectionModel<any>(true, []);
  @Input() displayedColumns: any[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() searchGrid: boolean;
  @Input() selectGrid: boolean;
  @Input() tableName: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() itemSelectEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAddEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemEditEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemViewEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemDeleteEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemRemoveEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemColUpEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemColDownEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemUnlockEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAnchorEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemCustomerEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemPdfEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemTranactionIDEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemExcelEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemCsvEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemRcIDEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemEnableDisableEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemRcLocalAddEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemDownloadEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemCheckStatusEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemTopUpEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemVoucherCodeEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemSettlementEvent: EventEmitter<number> = new EventEmitter();
  @Input() addNew: boolean;
  @Input() reject: boolean;
  @Input() approve: boolean;
  @Input() rejectLoad: boolean;
  @Input() approveLoad: boolean;
  @Input() rejectRecon: boolean;
  @Input() approveRecon: boolean;
  @Input() editable: boolean;
  @Input() view: boolean;
  @Input() deletable: boolean;
  @Input() pagination: boolean
  @Input() removable: boolean;
  @Input() positions: boolean;
  @Input() filterLabel: string;
  @Input() isCheck: boolean;
  @Input() tableType: string = 'role';
  @Input() defaultSort: string;
  @Input() ascendingSort: string;
  @Input() pdf: boolean;
  @Input() excel: boolean;
  @Input() csv: boolean;
  @Input() addNewLocalRc: boolean;
  @Input() addg: boolean;
  @Input() blockable: boolean;
  @Input() topUp: boolean;
  @Input() approveBlacklist: boolean;
  @Input() rejectBlacklist: boolean;
  @Input() voucherTopUp: boolean;
  @Input() voucherSettlement: boolean;

  filterText: string;
  columns: string[] = [];
  isAdmin: boolean = false;
  isEditable: boolean = false;
  checkUser: boolean = false;
  userId: any;
  showMe: boolean = false;
  indexArray: string[] = [];
  fileDetails: any;
  data: any;
  updatedReason: any;

  constructor(
    private userManageSer: UserManagementService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog, private apprrefpay: ApproveRefundPayoutService, private refSer: RefundPayoutService,
    private helper: HelperService, private autoRecon: AutoReconService, private blacklistService: BlacklistCustomerService,
    private pcbdcService: PcbdcService, public datePipe: DatePipe) {
    this.fileDetails = this.data?.fileDetails;
  }



  ngOnInit(): void {
    this.columns = [];
    this.displayedColumns.forEach(val => {
      this.columns.push(val.name);
    })
    const permissions = this.userService?.userSessionData?.data?.user?.roles?.map((t: any) => t.permissions.map((f: any) => f.id)).flat();
    this.userId = this.userService?.userSessionData?.data?.user?.id
    this.isAdmin = permissions?.some((item: any) => permissions?.includes('super-user'));
    this.isEditable = permissions?.some((item: any) => permissions?.includes('manage-' + this.tableType));
  }

  ngAfterViewInit() {
    this.sortAndPagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.sortAndPagination();
  }

  private sortAndPagination() {
    if (this.dataSource) {
      if (this.sort) {
        this.dataSource.sort = this.sort;
        if (this.defaultSort) {
          const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
        else if (this.ascendingSort) {
          const sortState: Sort = { active: this.ascendingSort, direction: 'asc' };
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
        }
      }

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onSelect(id: number) {
    this.itemSelectEvent.emit(id);
  }
  onAdd() {
    this.itemAddEvent.emit();
  }

  onEdit(id: number) {
    this.itemEditEvent.emit(id);
  }

  onView(id: number) {
    this.itemViewEvent.emit(id);
  }

  onDelete(id: any) {
    this.itemDeleteEvent.emit(id);
  }

  onRemove(id: any) {
    this.itemRemoveEvent.emit(id);
  }

  colUp(id: any) {
    this.itemColUpEvent.emit(id);
  }

  colDown(id: any) {
    this.itemColDownEvent.emit(id);
  }

  onUnlock(id: any) {
    this.itemUnlockEvent.emit(id);
  }
  downloadAsPDF() {
    this.itemPdfEvent.emit();
  }
  exportAsXLSX() {
    this.itemExcelEvent.emit();
  }
  downloadAsCSV() {
    this.itemCsvEvent.emit();
  }

  onAnchorClick(id: any) {
    this.itemAnchorEvent.emit(id);
  }
  onCustomerClick(id: any) {
    this.itemCustomerEvent.emit(id)
  }
  onTxnIdClick(id: any) {
    this.itemTranactionIDEvent.emit(id)
  }

  onRcClick(id: any) {
    this.itemRcIDEvent.emit(id)
  }

  rcedit(id: any) {
    const dialogRef = this.dialog.open(UpdateRcLocalComponent, {
      width: '60%',
      disableClose: true,
      data: { "data": id, }
    });
  }

  rcLocalAdd(row: any) {
    const dialogRef = this.dialog.open(AddRcLocalDialogComponent, {
      width: '60%',
      disableClose: true,
      data: { "data": row }
    });
  }
  toggletag() {
    this.showMe = !this.showMe;
  }
  openDialog() {
    this.itemAddEvent.emit();
  }
  setStatus(id: any) {
    this.itemEnableDisableEvent.emit(id);
  }
  downloadReport(row: any) {
    this.itemDownloadEvent.emit(row)
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  ApproveSelect() {
    // lets re-initialize the array
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      action: 'A'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("approve");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(ApprejDialogComponent, {
            width: '30%',
            data: { "payload": payload }
          });
        }
        else {
          this.selection.clear();
        }
      });
    }
  }
  RejectSelect() {
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      action: 'R'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("reject");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(ApprejDialogComponent, {
            width: '30%',
            data: { "payload": payload }
          });
        }
        else {
          this.selection.clear();
        }
      });
    }
  }
  confirmationPopUp(action: string) {
    return this.dialog.open(DialogComponent, {
      width: "300px",
      data: { "msgreject": `Are you sure, that you want to ` + action + ` the selected <b>` + this.indexArray.length + `</b> record(s)? `, "type": "confirm" }
    });

  }

  ApproveSelectLoad() {
    // lets re-initialize the array
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      action: 'A'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("approve");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(LoadDialogComponent, {
            width: '30%',
            data: { "payload": payload }
          });
        }
        else {
          this.selection.clear();
        }
      });
    }
  }
  RejectSelectLoad() {
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      action: 'R'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("reject");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(LoadDialogComponent, {
            width: '30%',
            data: { "payload": payload }
          });
        }
        else {
          this.selection.clear();
        }
      });
    }
  }


  ApproveSelectRecon() {
    // lets re-initialize the array
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      status: 'A'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("approve");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.autoRecon.loadapprove(payload).subscribe(res => {
            this.userService.reloadCurrentRoute();
          })
        }
        else {
          this.selection.clear();
        }
      });
    }
  }

  RejectSelectRecon() {
    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse(Constants.AT_LIST_ONE_TXN_MSG);
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      status: 'R'
    }
    if (this.indexArray.length >= 0) {
      const dialogRef = this.confirmationPopUp("reject");
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.autoRecon.loadreject(payload).subscribe(res => {
            this.userService.reloadCurrentRoute();
          })
        }
        else {
          this.selection.clear();
        }
      });
    }
  }

  ApproveRejectBlacklist(action: any) {

    this.indexArray = [];
    this.selection.selected.forEach(s => {
      this.indexArray.push(s.id);
    });
    if (this.indexArray.length == 0) {
      this.helper.errorResponse('Please select atleast 1 Record.');
      return;
    }
    let payload = {
      indexIds: this.indexArray,
      makerCheckerStatus: action,
    }
    if (this.indexArray.length >= 0) {
      const actionMessage = action === 'A' ? 'approve' : 'reject';
      const dialogRef = this.confirmationPopUp(actionMessage);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.blacklistService.approveRejectBlacklisting(payload).subscribe(res => {

            this.userService.reloadCurrentRoute();
            dialogRef.close();
          })
        } else {
          this.selection.clear();
        }
      });
    }
  }

  download(row: any) {

    this.refSer.getReport(row.token, row.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.helper.errorResponse(Constants.ERROR_DOWNLOADING_FILE);
    }, err => {
      this.helper.errorResponse(Constants.ERROR_DOWNLOADING_FILE);
    });
  }

  custedit(id: any) {
    const dialogRef = this.dialog.open(UpdateBlacklistCustomerComponent, {
      width: '60%',
      disableClose: true,
      data: { "data": id, }
    });
  }

  checkStatus(row: any) {
    this.itemCheckStatusEvent.emit(row)
  }

  downloadPcbdcBulkFile(row: any) {
    this.pcbdcService.getReport(row.token, row.id).subscribe(res => {
      const contentDisposition = res.headers.get('content-disposition');
      const fileName = contentDisposition?.split(';')[1].split('filename')[1].split('=')[1].trim()
        .replace("\"", "").replace("\"", "").replace('xlsx', 'xls');
      if (fileName) {
        FileSaver.saveAs(res.body, fileName);
      }
      else
        this.helper.errorResponse(Constants.ERROR_DOWNLOADING_FILE);
    }, err => {
      this.helper.errorResponse(Constants.ERROR_DOWNLOADING_FILE);
    });
  }

  onTopUp(id: number) {
    this.itemTopUpEvent.emit(id);
  }


  voucherCode(id: any) {
    this.itemVoucherCodeEvent.emit(id)
  }

  onSettlement(id: number) {
    this.itemSettlementEvent.emit(id);
  }

  getDaysUntilExpiry(item: any): string {

    const timeDifference = item.expiryTimestamp - Date.now();

    const hours = Math.floor((timeDifference / (1000 * 3600)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDifference / 1000) % 60);

    const daysUntilExpiry = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysUntilExpiry < 0) {
      // Expired
      const hours = Math.floor((timeDifference / (1000 * 3600)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      const expiredDays = Math.abs(daysUntilExpiry);

      const showExpiredDays = expiredDays === 1 ? expiredDays + ' day' : expiredDays + ' days';
      const showHours = ('0' + Math.abs(hours)).slice(-2);
      const showMinutes = ('0' + Math.abs(minutes)).slice(-2);
      const showSeconds = ('0' + Math.abs(seconds)).slice(-2);

      return `Rule Expired ${showExpiredDays}, ${showHours}:${showMinutes}:${showSeconds} ago.`;

    } else if (daysUntilExpiry === 0) {

      // Expires within the same day
      const hours = Math.floor((timeDifference / (1000 * 3600)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      return `Rule Expires today in ${hours}:${minutes}:${seconds}`;

    } else {

      const showDaysUntilExpiry = daysUntilExpiry === 1 ? daysUntilExpiry + ' day' : daysUntilExpiry + ' days'
      // Expires in the future
      return `Rule Expires in ${showDaysUntilExpiry}, ${hours}:${minutes}:${seconds}`;

    }
  }

}






