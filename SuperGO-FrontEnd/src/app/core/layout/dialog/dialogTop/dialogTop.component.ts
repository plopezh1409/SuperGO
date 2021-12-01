
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
    showLoad:boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) 
        public data: any, 
        private _snackBar: MatSnackBar, 
        private userService: UsuarioService) 
    {
        // se debe de realizar un deepclone ya que es multidimensional     
        this.modules = JSON.parse(JSON.stringify(data.modules));
        const {top}  = data;   
        if(this.modules.length>0)
        {   
            let uniqueModules: any[]=[];
            this.modules.forEach(page=>{
                let filter = page.module.operation.filter((op:any)=>op.url.trim().length>0);
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
                        let findIndex = page.module.operation.findIndex((op:any)=> topModule.url.includes(op.url));
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
        for (let i = 0; i < this.selected.length; i++) {
            if (!this.selected[i].data.active) {
                this.selected.splice(i, 1);
            }
        }
    }

    btnAccept() {
        let arr = new Object();
        let arr2 = new Array();
        if (this.selected.length + this.data.cantidad > 5) {
            this.openSnackBar(`Solo puedes tener 5 favoritos, gestiona tus favoritos`, 'Cerrar', 'errorToast');
        } 
        else 
        {            
            if(this.selected.length === 0){
                return this.openSnackBar(`Debes de seleccionar un favortio`, 'Cerrar', 'errorToast');
            }
            this.selected.forEach(element => {
                arr2.push(element.data);
            });

            this.showLoad = true;
            this.userService.modifyTop({tops:arr2},'create')
            .pipe(pluck('response'), finalize(()=>{this.showLoad=false;}))
            .subscribe((data: any) => {   
                console.log("btnAccept",data);
                this.openSnackBar(`Favorito Agregado Correctamente`, 'Cerrar', 'successToast');
                this.dialogRef.close({ success: true, data: data });
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
