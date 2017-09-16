import { Component } from '@angular/core';
import { generateData } from './generate-data';

@Component({
  selector: 'demo-basic',
  template: `
  <h2>basic</h2>
  <nz-tree [nzNodes]="nodes"
           [nzCheckable]="true"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoBasicComponent {
  nodes = [];

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }
}
