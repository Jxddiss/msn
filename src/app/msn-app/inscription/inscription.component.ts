import { Component, OnInit } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit{
  canBeFullScreen = false

  constructor(private _windowInfoService : WindowInfoService) { }

  ngOnInit(): void {
    this.onFullScreen()
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }

}
