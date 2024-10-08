import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './msn-app/login/login.component';
import { InscriptionComponent } from './msn-app/inscription/inscription.component';
import { HomeComponent } from './msn-app/home/home.component';
import { authentificationGuard } from './guard/authentification.guard';
import { ResetPasswordComponent } from './msn-app/login/reset-password/reset-password.component';
import { ChangePasswordComponent } from './msn-app/login/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login',
    children: [
      {path: '', component: LoginComponent, outlet: 'main'},
    ]
  },
  {
    path: 'reset-password',
    children: [
      {path: '', component: ResetPasswordComponent, outlet: 'main'},
    ]
  },
  {
    path: 'change-password',
    children: [
      {path: '', component: ChangePasswordComponent, outlet: 'main'},
    ]
  },
  {path: 'inscription',
    children: [
      {path: '', component: InscriptionComponent, outlet: 'main'},
    ]
  },
  { path: 'home',
    canActivate: [authentificationGuard],
    children: [
      {path: '', component: HomeComponent, outlet: 'main'},
    ]
   },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
