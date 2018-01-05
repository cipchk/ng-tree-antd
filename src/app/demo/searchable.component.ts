import { Component, ViewChild } from '@angular/core';
import { generateData } from './generate-data';
import { NzTreeComponent } from '../../../lib';

@Component({
  selector: 'demo-searchable',
  template: `
  <h2>Searchable</h2>
  <nz-input [nzType]="'search'" [nzPlaceHolder]="'input search text'" [(ngModel)]="q" (ngModelChange)="filterNodes()"></nz-input>
  <nz-tree #tree [nzNodes]="nodes"
           [nzOptions]="options"
           [nzCheckable]="true"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoSearchableComponent {
  q: string = '';

  nodes = [];

  options = {
    allowDrag: false
  };

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  filterNodes() {
    this.tree.treeModel.filterNodes(this.q);
    if (!this.q) this.tree.treeModel.collapseAll();
  }

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }
}
