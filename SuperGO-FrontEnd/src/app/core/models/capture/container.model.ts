import { Control } from './controls.model';

export interface Container{
    controls:Control[];
    name:string;
    idContainer:string;
    order:number;
    columns:number;
}