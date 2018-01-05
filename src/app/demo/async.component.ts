import { Component } from '@angular/core';

@Component({
  selector: 'demo-async',
  template: `
  <h2>Async</h2>
  <nz-tree [nzNodes]="nodes"
           [nzCheckable]="true"
           [nzOptions]="options"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoAsyncComponent {
  nodes = [
    {
      name: 'root1',
      hasChildren: true
    },
    {
      name: 'root2',
      hasChildren: true
    },
    {
      name: 'root3',
      hasChildren: true
    },
    {
      name: 'root4',
      hasChildren: true
    }
  ];

  options = {
    getChildren: (node: any) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve([
          { name: 'async data1' },
          { name: 'async data2', hasChildren: true }
        ]), 1000);
      });
    }
  };

  onEvent(ev: any) {
    console.log('async', 'onEvent', ev);
  }
}
