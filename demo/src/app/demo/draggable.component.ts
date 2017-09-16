import { Component } from '@angular/core';
import { generateData } from './generate-data';

@Component({
  selector: 'demo-draggable',
  template: `
  <h2>draggable</h2>
  <nz-tree [nzNodes]="nodes"
           [nzOptions]="options"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoDraggableComponent {
  nodes = [];

  options = {
    allowDrag: true
  };

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }
}
