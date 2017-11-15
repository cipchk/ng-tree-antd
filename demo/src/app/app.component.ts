import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <h1>ng-tree-antd</h1>
    <p>A antd style of based on angular-tree-component, <a href="https://github.com/cipchk/ng-tree-antd/blob/master/README.md" target="_blank">README.md</a>.</p>
    <div style="margin-top: 16px">
        <app-home></app-home>
    </div>
  `
})
export class AppComponent {
}
