import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import { SharedService } from './shared.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

interface TransactionHistory {
  mid: number;
  tid: number;
  externalMid: number;
  externalTid: number;
  name: string;
  transactionId: number,
  payeeWalletAddress: string,
  payeeName: string,
  payeeVPA: string,
  payeeMobile: number,
  payerWalletAddress: string,
  payerName: string,
  payerVPA: string,
  payerMobile: number,
  createdDate: number,
  amount: number,
  txnType: string,
  status: string
}

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  txnHistoryInfo: any[] = [];

  txnHistoryColumns: any[] = [
   
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'payerName', label: 'Payer Name' },
    { name: 'payeeName', label: 'Payee Name' },
    { name: 'date', label: 'Transaction Date' },
    { name: 'amount', label: 'Amount' },
    { name: 'type', label: 'Type' },
    { name: 'status', label: 'Status' },
  ];
  txnHistory: MatTableDataSource<TransactionHistory>;
  constructor(private httpClient: HttpClient, public datePipe: DatePipe, private sharedSer: SharedService) { }

  getTransactionHistory(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}token/search`, obj)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }
  getLatestTransactions(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}token/merchantRecords`, obj)
      .pipe(map(res => {
        if (res && res["payloadResponse"])
          res = JSON.parse(this.sharedSer.getDecryptedData(res["payloadResponse"]));
        else
          res = null;
        return res;
      }));
  }



  public exportAsExcelFile(json: any[], excelFileName: string): void {
    // Excel Title, Header, Data
    const title = excelFileName;
    let header: string[] = [];
    Object.keys(json[0]).forEach(key => {
      header.push(key);
    });

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');


    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { size: 16, bold: true };
    worksheet.addRow([]);
    worksheet.mergeCells('A1:H2');

    // Blank Row
    worksheet.addRow([]);

    // Add Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true }

   

    // Add Data and Conditional Formatting
    json.forEach((value: any) => {
      let row: string[] = [];
      Object.keys(json[0]).forEach(key => {
        row.push(value[key]);
      });
      worksheet.addRow(row)
    });

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, excelFileName + ' ' + this.datePipe?.transform(new Date(), 'dd-MM-yyyy') + '.xlsx');
    });

  }
}
