import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <div nz-row [nzGutter]="16">
      <div nz-col [nzSpan]="12"><demo-basic></demo-basic></div>
      <div nz-col [nzSpan]="12"><demo-async></demo-async></div>
      <div nz-col [nzSpan]="12"><demo-draggable></demo-draggable></div>
      <div nz-col [nzSpan]="12"><demo-searchable></demo-searchable></div>
      <div nz-col [nzSpan]="12"><demo-line></demo-line></div>
      <div nz-col [nzSpan]="12"><demo-custom></demo-custom></div>
      <div nz-col [nzSpan]="12"><demo-linkage></demo-linkage></div>
  </div>
  `
})
export class HomeComponent {
}
