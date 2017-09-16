import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <div class="row">
    <div class="col-6">
      <demo-basic></demo-basic>
    </div>
    <div class="col-6">
      <demo-async></demo-async>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <demo-draggable></demo-draggable>
    </div>
    <div class="col-6">
      <demo-searchable></demo-searchable>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <demo-line></demo-line>
    </div>
    <div class="col-6">
    </div>
  </div>
  `
})
export class HomeComponent {
}
