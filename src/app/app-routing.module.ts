import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './msn-app/login/login.component';
import { InscriptionComponent } from './msn-app/inscription/inscription.component';

const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'inscription', component: InscriptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
