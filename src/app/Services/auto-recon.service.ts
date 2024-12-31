import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AutoReconService {

  recon_File_Type: number = 8;

  //Manual Transaction column
  columnsUPI: any[] = [
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'upi', label: 'UPI' },
    { name: 'orgStatus', label: 'Original Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'upiRetryCount', label: 'Upi Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'makerCheckerStatus', label: 'Status' },
    { name: 'remark', label: 'Remarks' }

  ];

  columnsUPIRev: any[] = [
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'upi', label: 'UPI' },
    { name: 'upiReversal', label: 'UPI Reversal' },
    { name: 'orgStatus', label: 'Orginal Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'upiRetryCount', label: 'Upi Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'reversalRrn', label: 'Reversal RRN' },
    { name: 'makerCheckerStatus', label: 'Status' },
    { name: 'upiManualAction', label: 'UPI Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];


  columnsCBS: any[] = [
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'orgStatus', label: 'Orginal Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }
  ];

  columnsCBSRev: any[] = [
    { name: 'id', label: 'Sr.no' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'amount', label: 'Amount' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'subType', label: 'Transaction Sub Type' },
    { name: 'pso', label: 'PSO' },
    { name: 'cbsReversal', label: 'CBS Reversal' },
    { name: 'orgStatus', label: 'Orginal Status' },
    { name: 'orgRc', label: 'Original Rc' },
    { name: 'cbsRetryCount', label: 'CBS Retry Count' },
    { name: 'rrn', label: 'RRN' },
    { name: 'cbsManualAction', label: 'CBS Manual Action' },
    { name: 'remark', label: 'Remarks' }

  ];



  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helper: HelperService, public datePipe: DatePipe) { }

  // Manual Transaction get records
  search(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}recon/getReconEligibleTxn`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  // Manual Transaction Status
  getByStatus(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}recon/find-by-status`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  //Approve/Reject auto recon
  loadapprove(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}recon/approve-reject`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  loadreject(request: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}recon/approve-reject`, request)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  // Manual Transaction history
  autoReconHistory(obj: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}recon/history`, obj)
      .pipe(map(res => this.helper.handleResponse(res)));
  }

  //Bulk file upload
  uploadFileAndData(file: File, fileSubType: string): Observable<any> {
    const formData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    formData.append('subType', fileSubType); // Append concatenated type
    return this.httpClient.post<any>(`${environment.apiUrl}bulk-file-upload/request/recon-bulk-upload`, formData, { headers: headers });
  }
  getFileStatus(token: any, id: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/status/${token}/${id}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  getReport(token: any, id: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    });

    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/report/${token}/${id}`,
      { headers: header, responseType: 'blob' as 'json', observe: 'response' })
      .pipe(map(res => {

        return res;
      }));
  }

  //File based history
  bulkHistroy(fileSubType: any) {
    return this.httpClient.get<any>(`${environment.apiUrl}bulk-file-upload/history/` + this.recon_File_Type + '/' + fileSubType)
      .pipe(map(res => this.helper.handleResponse(res)));
  }


  //Download excel Manual Transaction
  public exportAsExcelFile(json: any[], excelFileName: string, columnList: any): void {
    // Excel Title, Header, Data
    const title = excelFileName;
    let header: string[] = [];
    columnList.forEach((element: any) => {
      if (element.label !== 'Sr.no') {
        if (element.title) {
          header.push(element.title);
        } else {
          header.push(element.label);
        }
      }
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');

    // Add Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true }

    // Find the index of the "Sr No" column
    const srNoIndex = columnList.findIndex((column: any) => column.label === 'Sr.no');
    // Add Data and Conditional Formatting
    json.forEach((value: any, index: number) => {
      let row: string[] = [];
      Object.keys(json[0]).forEach((key, index) => {
        if (index !== srNoIndex) {
          row.push(value[key]);
        }
      });
      worksheet.addRow(row)
    });



    // / Auto fit columns
    worksheet.columns.forEach(column => {
      if (column && column.eachCell) { // Check if column exists and has eachCell method
        let maxLength = 0;
        column.eachCell(cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      }
    });

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, excelFileName + ' ' + this.datePipe?.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')?.replace(/:/g, '_') + '.xlsx');

    });

  }





}
