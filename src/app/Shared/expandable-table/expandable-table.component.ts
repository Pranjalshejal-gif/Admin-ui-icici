import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { UserService } from 'src/app/Services/user.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'app-expandable-table',
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ExpandableTableComponent implements OnInit, AfterViewInit {
  columns: Array<any>;
  columnsToDisplay: Array<any>;
  columnsToDisplayWithExpand: Array<any>;
  expandedElement: any;
  serviceData: any;

  @Input('displayedColumns')
  set _displayedColumns(data: Array<any>) {
    this.columns = data;
    this.columnsToDisplay = data//.map(t => t.label)
    const permissions = this.userService?.userSessionData?.data?.user?.roles?.map((t: any) => t.permissions.map((f: any) => f.id)).flat();
    let isManageMerchant = permissions?.some((item: any) => permissions?.includes('super-user') || permissions?.includes('manage-merchant'));
    let isManageTxn = permissions?.some((item: any) => permissions?.includes('super-user') || permissions?.includes('view-tokensearch'));
    this.serviceData = this.dashboardSer.getServiceData();

    if (isManageMerchant && this.serviceData == 'isMerchant') {
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(t => t.name), 'expand', 'action'];
    } else if (isManageTxn && this.serviceData == 'upiClientTxnDetails') {
      // this.columnsToDisplayWithExpand = ['upiexpand', ...this.columnsToDisplay.map(t => t.name)];
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(t => t.name)];
    } else {
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay.map(t => t.name)];
    }
  }
  @Input() dataSource: MatTableDataSource<any>;
  @Input() searchGrid: boolean;
  @Input() selectGrid: boolean;
  @Input() filterLabel: string;
  @Input() isEnable: boolean;
  @Input() disableLink: boolean = false;
  @Input() deletable: boolean;
  @Input() editable: boolean;
  @Input() defaultSort: string;
  @Input() pagination: boolean;
  @Input() pdf: boolean;
  @Input() excel: boolean;
  @Input() csv: boolean;
  @Input() myData: any[];
  @Input() blockable: boolean;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() itemEditEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemDeleteEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemAnchorEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemEnableEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemEnableDisableEvent: EventEmitter<any> = new EventEmitter();
  @Output() itemTranactionIDEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemPdfEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemExcelEvent: EventEmitter<number> = new EventEmitter();
  @Output() itemCsvEvent: EventEmitter<number> = new EventEmitter();

  filterText: string;

  constructor(private userService: UserService, private dashboardSer: DashboardService,) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    if (this.defaultSort) {
      const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.sort = this.sort;
    if (this.sort && this.defaultSort) {
      const sortState: Sort = { active: this.defaultSort, direction: 'desc' };
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onAnchorClick(row: any) {
    this.itemAnchorEvent.emit(row);
  }
  isExpanded(element: any) {
    element['expanded'] = !element['expanded'];

  }
  onEdit(row: any) {
    this.itemEditEvent.emit(row);
  }

  onDelete(id: any) {
    this.itemDeleteEvent.emit(id);
  }

  setStatus(id: any) {
    this.itemEnableDisableEvent.emit(id);
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

  onTxnIdClick(id: any) {
    this.itemTranactionIDEvent.emit(id)
  }
  hasUpiClientTxnDetails(element: any): boolean {
    return !!element?.upiClientTxnDetails;
  }

}
