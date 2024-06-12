import { Injectable } from '@angular/core';
import { Erreur } from '../model/erreur.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErreurService {

  private _erreursEvent = new Subject<Erreur>();
  erreursEvent$ = this._erreursEvent.asObservable();

  constructor() { }

  onErreursEvent(erreur: Erreur) {
    this._erreursEvent.next(erreur);
  }
}
