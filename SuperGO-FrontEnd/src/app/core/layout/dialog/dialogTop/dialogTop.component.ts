
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AppComponent } from '@app/app.component';
import { UsuarioService } from '@app/core/services/public/usuario.service';
import { finalize, pluck } from 'rxjs/operators';

@Component({
    selector: 'app-dialogTop',
    templateUrl: './dialogTop.component.html',
    styleUrls: ['./dialogTop.component.sass']
})

export class DialogTop {
    modules: any[] = [];
    selected: any[] = [];
    showLoad = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) 
        public data: any, 
        private readonly _snackBar: MatSnackBar, 
        private readonly userService: UsuarioService) 
    {
        // se debe de realizar un deepclone ya que es multidimensional     
        this.modules = JSON.parse(JSON.stringify(data.modules));
        const {top}  = data;   
        if(this.modules.length>0)
        {   
            const uniqueModules: any[]=[];
            this.modules.forEach(page=>{
                const filter = page.module.operation.filter((op:any)=>op.url.trim().length>0);
                page.module.operation = filter;

                page.module['active'] = false;                 
                page.module.operation.forEach((op:any) => {
                    op['active']=false;
                });                 
                
                if(uniqueModules.findIndex((pg)=> Number(page.module.id) === Number(pg.module.id)) <= -1)
                {
                    uniqueModules.push(page);
                }
            });   

            this.modules = uniqueModules;
            if(top && top.length>0)
            {
                top.forEach((topModule:any) => {
                    this.modules.forEach(page=>{
                        const findIndex = page.module.operation.findIndex((op:any)=> topModule.url.includes(op.url));
                        if(findIndex >-1)
                        {
                            page.module.operation.splice(findIndex,1);
                        }                                                
                    }); 
                });
            }            
        }
    }    

    addTop(i: any, a: any) {
        if (a >= 0) {
            this.modules[i].module.operation[a].active = !this.modules[i].module.operation[a].active;
            if (this.modules[i].module.operation[a].active === true) {
                this.selected.push({ data: this.modules[i].module.operation[a] });
            }
        } else {
            this.modules[i].module.active = !this.modules[i].module.active;
            if (this.modules[i].module.active === true) {
                this.selected.push({ data: this.modules[i].module });
            }
        }
        for (let j = 0; j < this.selected.length; j++) {
            if (!this.selected[j].data.active) {
                this.selected.splice(j, 1);
            }
        }
    }

    btnAccept() {        
        const arr2 = new Array();
        const maxtop = 5;
        if (Number(this.selected.length) + Number(this.data.cantidad) > maxtop) {
            this.openSnackBar(`Solo puedes tener 5 favoritos, gestiona tus favoritos`, 'Cerrar', 'errorToast');
        } 
        else 
        {            
            if(this.selected.length === 0){
                this.openSnackBar(`Debes de seleccionar un favortio`, 'Cerrar', 'errorToast');
                return;
            }
            
            this.selected.forEach(element => {
                arr2.push(element.data);
            });
            this.showLoad = true;
            this.userService.modifyTop({tops:arr2},'create')
            .pipe(pluck('response'), finalize(()=>{this.showLoad=false;}))
            .subscribe((data: any) => {   
                
                this.openSnackBar(`Favorito Agregado Correctamente`, 'Cerrar', 'successToast');
                this.dialogRef.close({ success: true, data });
            });
        }
    }

    openSnackBar(message: any, action: any, type: any) {

        this._snackBar.open(message, action, {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: [type],
            duration: 3000
        });
    }

    cerrarDialogo(): void {
        this.dialogRef.close();
      }
}
