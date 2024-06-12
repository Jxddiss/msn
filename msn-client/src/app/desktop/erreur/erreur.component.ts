import { Component, EventEmitter } from '@angular/core';
import { Erreur } from '../../model/erreur.model';

@Component({
  selector: 'app-erreur',
  templateUrl: './erreur.component.html',
  styleUrl: './erreur.component.css'
})
export class ErreurComponent {
  erreur : Erreur | undefined
  close = new EventEmitter()

  onClose(){
    this.close.emit()
  }

}
