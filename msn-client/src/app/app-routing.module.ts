import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './msn-app/login/login.component';
import { InscriptionComponent } from './msn-app/inscription/inscription.component';
import { HomeComponent } from './msn-app/home/home.component';
import { authentificationGuard } from './guard/authentification.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login',
    children: [
      {path: '', component: LoginComponent, outlet: 'main'},
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
