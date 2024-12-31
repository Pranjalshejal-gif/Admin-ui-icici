import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportFilter',
  pure: false
})
export class ReportFilterPipe implements PipeTransform {

  transform(items: any[], filter: number): any {
    var i = items.filter(item => item.id == filter);
    return i && i.length> 0 ? i : [-1];
  }

}