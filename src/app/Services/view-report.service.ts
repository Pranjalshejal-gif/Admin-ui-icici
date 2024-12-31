import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';


@Injectable({
  providedIn: 'root'
})
export class ViewReportService {

  constructor(private httpClient: HttpClient, public datePipe: DatePipe, private sharedSer: SharedService, private helper: HelperService) { }

  getReportsForCategory(id: number) {
    return this.httpClient.get<any>(`${environment.apiUrl}report/get-reportName/${id}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }
  fetchReportByName(name: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}report/schema/${name}`)
      .pipe(map(res => this.helper.handleResponse(res)));
  }



  public exportAsExcelFile(json: any[], excelFileName: string, columnList: any): void {
    // Excel Title, Header, Data
    const title = excelFileName;
    let header:string[] = [];

    columnList.forEach((element:any) => {
      if(element.title) {
        header.push(element.title);
      } else {
        header.push(element.label);
      }
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
        headerRow.font = { bold: true}


    // Add Data and Conditional Formatting
    json.forEach((value:any) => {
      let row:string[] = [];
      Object.keys(json[0]).forEach(key => {
        row.push(value[key]);
      });
      worksheet.addRow(row)
    });

    // Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, excelFileName+ ' ' + this.datePipe?.transform(new Date(),'dd-MM-yyyy')+'.xlsx');
    });

  }

}
