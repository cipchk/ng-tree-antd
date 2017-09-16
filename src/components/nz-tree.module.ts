import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { NzTreeComponent } from './nz-tree.component';

import { TreeModule } from 'angular-tree-component';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [NzTreeComponent],
    exports: [NzTreeComponent]
})
export class NzTreeModule { }
