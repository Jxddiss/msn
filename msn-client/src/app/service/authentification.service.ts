import { Injectable } from '@angular/core';
import { Utilisateur } from '../model/utilisateur.model';
import { USERS } from '../mocks/utilisateurs.mock';
import { environment } from '../constants/environment.constant';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private _backend = environment.apiUrl;
  private _token : string | null = null;
  private _jwtHelper = new JwtHelperService();

  constructor(private _httpClient : HttpClient) { }

  login(utilisateur : Utilisateur) : Observable<HttpResponse<Utilisateur>>{
    return this._httpClient.post<Utilisateur>(this._backend + 'login', utilisateur, {observe : 'response'})
  }

  addUserToLocalStorage(utilisateur : Utilisateur) {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  }

  isLoggedIn():boolean{
    this.loadToken();
    if(this._token != null && this._token !== ''){
      if(this._jwtHelper.decodeToken(this._token).sub != null || '' || undefined){
        if(!this._jwtHelper.isTokenExpired(this._token)){
          return true;
        }
      }
    }else{
      this.logout();
      return false;
    }
    return false;
  }

  logout() {
    this._token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  loadToken() : void{
    this._token = localStorage.getItem('token');
  }

  saveToken(token : string) : void{
    this._token = token;
    localStorage.setItem('token', token);
  }

  get loggedUser() : Utilisateur | undefined {
    if(!this.isLoggedIn()) return undefined
    return JSON.parse(localStorage.getItem('utilisateur')!)
  }
}
