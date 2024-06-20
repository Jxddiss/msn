import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import { MsnApp } from './msn-app/msn-app.component';
import { DesktopComponent } from './desktop/desktop.component';
import { TaskbarComponent } from './desktop/taskbar/taskbar.component';
import localeFr from '@angular/common/locales/fr';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { LoginComponent } from './msn-app/login/login.component';
import { InscriptionComponent } from './msn-app/inscription/inscription.component';
import { HomeComponent } from './msn-app/home/home.component';
import { UserCardComponent } from './msn-app/home/user-card/user-card.component';
import { ActivityHolderComponent } from './msn-app/home/activity-holder/activity-holder.component';
import { UserListComponent } from './msn-app/home/activity-holder/user-list/user-list.component';
import { ChatboxComponent } from './msn-app/home/chatbox/chatbox.component';
import { ProfileHolderComponent } from './msn-app/home/chatbox/profile-holder/profile-holder.component';
import { NotificationComponent } from './desktop/notification/notification.component';
import { ErreurComponent } from './desktop/erreur/erreur.component';
import { EmojiPickerComponent } from './msn-app/home/chatbox/emoji-picker/emoji-picker.component';
import { WinksPickerComponent } from './msn-app/home/chatbox/winks-picker/winks-picker.component';
import { TextEditComponent } from './msn-app/home/chatbox/text-edit/text-edit.component';
import { FormsModule } from '@angular/forms';
import { AmisEditComponent } from './msn-app/amis-edit/amis-edit.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './interceptor/auth-interceptor.interceptor';
import { RxStompService } from './service/rx-stomp.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';

registerLocaleData(localeFr)

@NgModule({
  declarations: [
    AppComponent,
    MsnApp,
    DesktopComponent,
    TaskbarComponent,
    LoginComponent,
    InscriptionComponent,
    HomeComponent,
    UserCardComponent,
    ActivityHolderComponent,
    UserListComponent,
    ChatboxComponent,
    ProfileHolderComponent,
    NotificationComponent,
    ErreurComponent,
    EmojiPickerComponent,
    WinksPickerComponent,
    TextEditComponent,
    AmisEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue:'fr-FR'},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
