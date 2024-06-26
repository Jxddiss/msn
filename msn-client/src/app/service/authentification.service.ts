import { Injectable } from '@angular/core';
import { Utilisateur } from '../model/utilisateur.model';
import { environment } from '../constants/environment.constant';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { RxStompService } from './rx-stomp.service';
import { myRxStompConfig } from '../my-rx-stomp.config';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private _backend = environment.apiUrl;
  private _token : string | null = null;
  private _jwtHelper = new JwtHelperService();
  private _tokenSubject = new Subject<string>();
  token$ = this._tokenSubject.asObservable();
  private _websocketConfigured :boolean = false;
  loggedUser : Utilisateur | undefined = localStorage.getItem('utilisateur') ? JSON.parse(localStorage.getItem('utilisateur')!) : undefined;

  constructor(private _httpClient : HttpClient, private _rxStompService : RxStompService) { }

  login(utilisateur : Utilisateur) : Observable<HttpResponse<Utilisateur>>{
    return this._httpClient.post<Utilisateur>(this._backend + 'login', utilisateur, {observe : 'response'})
  }

  configureWebsocket() : void{
    if(!this._websocketConfigured){
      this._websocketConfigured = true
      this._rxStompService.configure({...myRxStompConfig,connectHeaders : {
        Authorization : 'Bearer ' + this._token
      }})
      this._rxStompService.activate()
    }
  }

  addUserToLocalStorage(utilisateur : Utilisateur) {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    this.updateLoggedUser()
  }

  isLoggedIn():boolean{
    this.loadToken();
    if(this._token != null && this._token !== ''){
      if(this._jwtHelper.decodeToken(this._token).sub != null || '' || undefined){
        if(!this._jwtHelper.isTokenExpired(this._token)){
          this.configureWebsocket();
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
    this._rxStompService.deactivate()
    this._websocketConfigured = false
  }

  setDisconnected() : void{
    const sub = this._httpClient.put(this._backend + 'logout/'+this._jwtHelper.decodeToken(this._token!).sub, null).subscribe();
    setTimeout(()=>{sub.unsubscribe()},500)
  }

  loadToken() : void{
    this._token = localStorage.getItem('token');
  }

  saveToken(token : string) : void{
    this._token = token;
    localStorage.setItem('token', token);
    this._tokenSubject.next(token)
  }

  updateLoggedUser() : void{
    this.loggedUser = JSON.parse(localStorage.getItem('utilisateur')!)
  }

  getToken() : string | null{
    return this._token;
  }
}
