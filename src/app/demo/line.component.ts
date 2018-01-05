import { Component } from '@angular/core';
import { generateData } from './generate-data';

@Component({
  selector: 'demo-line',
  template: `
  <h2>Line</h2>
  <nz-tree [nzNodes]="nodes"
           [nzShowLine]="true"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoLineComponent {
  nodes = [];

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('line', 'onEvent', ev);
  }
}
