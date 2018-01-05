import { Component, OnInit } from '@angular/core';
import { generateData } from './generate-data';

@Component({
    selector: 'demo-custom',
    template: `
    <h2>custom</h2>
    <nz-tree [nzNodes]="nodes"
             [nzCheckable]="true"
             (nzEvent)="onEvent($event)">
        <ng-template #nzTitle let-node>
            <i class="anticon anticon-smile-o"></i> {{node.displayField}}
        </ng-template>
    </nz-tree>
    `
})
export class DemoCustomComponent implements OnInit {
  nodes = [];

  ngOnInit() {
    generateData(this.nodes, 3, 2, 1);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }
}
