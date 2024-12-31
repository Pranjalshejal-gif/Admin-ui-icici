import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PcbdcService } from 'src/app/Services/pcbdc.service';
import { RuleRemarkDialogComponent } from './rule-remark-dialog/rule-remark-dialog.component';

@Component({
  selector: 'app-rule-history',
  templateUrl: './rule-history.component.html',
  styleUrls: ['./rule-history.component.scss']
})
export class RuleHistoryComponent implements OnInit {

  dataSourcePcbdc: MatTableDataSource<any>;
  Columns: string[];

  constructor(private pcbdcService: PcbdcService, public dialog: MatDialog) { }
  data: any;

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.Columns = this.pcbdcService.ruleHistoryColumns;
    this.pcbdcService.ruleHistory().subscribe(res => {
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

          obj.type = obj.type === "U" ? 'UPDATE' :
            obj.type === "C" ? 'CREATE' :
              obj.type === "T" ? 'TOP-UP' :
                '';
        });
        this.dataSourcePcbdc = new MatTableDataSource(res.data);
      }
    });
  }

  openDialog(evt: any) {
    const dialogRef = this.dialog.open(RuleRemarkDialogComponent, {
      width: '40%',
      maxHeight: '52500px',
      data: { "row": evt },
      autoFocus: false
    });
  }
}
