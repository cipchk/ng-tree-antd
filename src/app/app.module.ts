import { HttpModule } from '@angular/http';
import { NgModule, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { NzTreeModule } from '../../lib';

import { AppComponent } from './app.component';
import { DemoBasicComponent } from './demo/basic.component';
import { DemoAsyncComponent } from './demo/async.component';
import { HomeComponent } from './demo/home.component';
import { DemoDraggableComponent } from './demo/draggable.component';
import { DemoSearchableComponent } from './demo/searchable.component';
import { DemoLineComponent } from './demo/line.component';
import { DemoCustomComponent } from './demo/custom.component';
import { DemoLinkageComponent } from './demo/linkage.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,

    NzTreeModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    DemoBasicComponent,
    DemoAsyncComponent,
    DemoDraggableComponent,
    DemoSearchableComponent,
    DemoLineComponent,
    DemoCustomComponent,
    DemoLinkageComponent
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
