import { Component } from '@angular/core';
import { generateData } from './generate-data';

@Component({
  selector: 'demo-linkage',
  template: `
  <h2>Linkage</h2>
  <nz-tree [nzNodes]="nodes"
           [nzCheckable]="true"
           [nzAllowChildLinkage]="false"
           [nzAllowParentLinkage]="false"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoLinkageComponent {
  nodes = [];

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('DemoLinkageComponent', 'onEvent', ev);
  }
}
