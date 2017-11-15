import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TreeModule } from 'angular-tree-component';

import { NzTreeComponent } from './components/nz-tree.component';

export { NzTreeOptions } from './components/nz-tree.options';
export { NzTreeComponent } from './components/nz-tree.component';

@NgModule({
    imports: [CommonModule, TreeModule],
    declarations: [NzTreeComponent],
    exports: [NzTreeComponent]
})
export class NzTreeModule { }
