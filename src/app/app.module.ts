import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import { MsnApp } from './msn-app/msn-app.component';



@NgModule({
  declarations: [
    AppComponent,
    MsnApp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdkDrag,
    CdkDragHandle
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
