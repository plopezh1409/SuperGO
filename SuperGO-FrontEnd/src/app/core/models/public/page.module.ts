
import { Module } from './module.model';
import { Role } from './role.module';

export interface Page{
    module : Module;
    role : Role;
}