import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class ReportsModule {

  descargarExcel(module: string, dataReporting: any[], headers:string[]) {
    const objlist: string[] = [];
    //Flujo generico
    dataReporting.forEach((tx: any) => {
      let _objJson = `{`;
      _objJson = this.getPlaneObject(tx, '', _objJson);
      _objJson = _objJson.substring(0, _objJson.length - 1);
      _objJson = `${_objJson} }`;
      objlist.push(JSON.parse(_objJson));
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(objlist);
    ws['!autofilter']={ref:"A1:Q1"};
    XLSX.utils.sheet_add_aoa(ws, [headers]);
    XLSX.utils.sheet_add_json(ws, objlist, { origin: 'A2', skipHeader: true });
    ws['!cols'] = [{wch: 30},{wch: 30}, {wch: 30}, {wch: 30},{wch: 30},{wch: 30},{wch: 30},{wch: 30},{wch: 30}];
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Detalle${module}`);
    XLSX.writeFile( wb, `Detalle${module}-${new Date().toISOString()}.xlsx` );
  }

  getPlaneObject(tx: any, pattern: string, objJson: string) {
    Object.keys(tx).forEach((ky) => {
      if (typeof tx[ky] === 'object') {
        pattern = ky;
        objJson = `${this.getPlaneObject(tx[ky], pattern, objJson)}`;
      } 
      else 
      {
        const patt = pattern.trim().length > 0 ? `${pattern.trim()}_` : '';
        objJson = `${objJson}"${patt}${ky}":"${tx[ky]}",`;
      }
    });
    return objJson;
  }

}
