import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import { MsnApp } from './msn-app/msn-app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { TaskbarComponent } from './desktop/taskbar/taskbar.component';



@NgModule({
  declarations: [
    AppComponent,
    MsnApp,
    DesktopComponent,
    TaskbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdkDrag,
    CdkDragHandle
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
