import { Component, OnInit } from '@angular/core';
import { generateData } from './generate-data';

@Component({
    selector: 'demo-custom',
    template: `
    <h2>custom</h2>
    <nz-tree [nzNodes]="nodes"
             [nzCheckable]="true" [nzAutoExpandParent]="1"
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
    this.nodes[0].children[2].checked = true;
    this.nodes[1].children[0].checked = true;
    this.nodes[2].checked = true;
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }
}
