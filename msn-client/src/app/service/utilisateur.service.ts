import { Injectable } from '@angular/core';
import { environment } from '../constants/environment.constant';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../model/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private backendUrl = environment.apiUrl

  constructor(private _httpClient : HttpClient) { }

  updateUtilisateur(formData : FormData, id : number) {
    return this._httpClient
      .put<Utilisateur>(`${this.backendUrl}utilisateur/update/${id}`, formData,{
        observe : 'response'})
  }

  createFormData(utilisateur : Utilisateur, avatar : File | null, banner : File | null) : FormData {
    const formData = new FormData();
    formData.append('nom', utilisateur.nomComplet);
    formData.append('statut', utilisateur.statut);
    formData.append('description', utilisateur.description ?? '');
    formData.append('avatar', avatar!);
    formData.append('banniere', banner!);
    return formData;
  }
}
