import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({selector: '[appDropArchivo]'})
export class DropArchivoDirective{
  @HostBinding('class.fileOver') fileOver: boolean;
  @Output() dropArchivo = new EventEmitter<any>();

  constructor()
  {
    this.fileOver =  false;
  }

  @HostListener('dragover', ['$event']) onDragOver(evt: any): void
  {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave',['$event'])public onDragLeave(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event'])public onDrop(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const archivos = evt.dataTransfer.files;
    if (archivos.length > 0) {
      this.dropArchivo.emit(archivos);
    }
  }
}