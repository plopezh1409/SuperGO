import { animate, state, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class invoicesTableComponent implements OnInit {
  @Input() optionsType:string;  
  @Input() hideColumns:string[];
  @Input() expandedvalue:string;
  @Input() dataInfo:any[];  
  displayedColumns: string[];
  dataSource : MatTableDataSource<any>;
  totalRows:number;
  pageEvent: PageEvent;
  decimalPipe : DecimalPipe;
  expandedElement: any | null;     

  //PAGINATOR AND SORT
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  constructor( ) { 
    this.totalRows = 0;
    this.pageEvent= new PageEvent();
    this.dataSource = new MatTableDataSource();
    this.displayedColumns=[];
    this.decimalPipe = new DecimalPipe(navigator.language);
    this.dataInfo=[];
    this.optionsType='';    
    this.hideColumns = [];
    this.expandedvalue = '';
  }

  ngOnInit(): void {        
    this.loadInformation(this.dataInfo);
  }

  loadInformation(dataInfo:any[]):void
  { 
    this.displayedColumns=[];
    this.dataInfo = dataInfo;
    if(this.dataInfo.length > 0)
      {        
        if(this.dataInfo[0].cuentas!=undefined && this.dataInfo[0].cuentas.length>0)
        {
          this.displayedColumns.push('Detalle');
        }
        
        const keys = Object.keys(this.dataInfo[0]);        
        keys.forEach((x:string) => {
          const hc = this.hideColumns.filter( c =>  c == x );
          if(hc.length <= 0)
          {
            this.displayedColumns.push(x);
          }
        });        
      }
      this.dataSource = new MatTableDataSource<any>(this.dataInfo);    
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalRows = this.dataInfo.length;
  }

  ngAfterViewInit(): void {    
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${this.decimalPipe.transform(length)}`;
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }    

  aplicarFiltro(event: Event): void {
    const filterValue  = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      setTimeout(()=>this.totalRows = this.dataSource.paginator?.length!=undefined?this.dataSource.paginator?.length:this.dataInfo.length); 
    }
  }

  setHideColumns(hcols:any[])
  {
    this.hideColumns = hcols;
  }
  
  expandInfo(row:any):string
  {    
    this.expandedElement = this.expandedElement === row ? null : row;
    return this.loadsubInfo(row);
  }

  headersList(obj:any):string[]{
    return  Object.keys(obj); 
  }

  contentList(obj:any):string[]
  {
    const keys = Object.keys(obj);
    const content:any[]=[];
    keys.forEach(k=>{
      content.push(obj[k].trim().toUpperCase());
    });
    
    return content;
  }

  loadsubInfo(element:any): string
  {
    let tbl='';    
    if(element.cuentas!=undefined && element.length>0)
    {
      tbl = '<table>';
      const keys= Object.keys(element);
        keys.forEach((c:any) => {
        tbl = tbl.concat(`<tr><th>${c}</th></tr>`);
      });    
    }
    
    return tbl;
  }
}
