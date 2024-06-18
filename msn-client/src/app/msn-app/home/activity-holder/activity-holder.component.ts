import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';

@Component({
  selector: 'app-activity-holder',
  templateUrl: './activity-holder.component.html',
  styleUrl: './activity-holder.component.css'
})
export class ActivityHolderComponent {
  @ViewChild('showMenu') showMenu !: ElementRef;

  constructor(private _windowInfoService : WindowInfoService) { }

  onShowDialogAjout() {
    this._windowInfoService.onOpenDialogAjout()
  }

  onShowDialogInviter() {
    this._windowInfoService.onOpenDialogInviter()
  }

  onShowDialogDemandes() {
    this._windowInfoService.onOpenDialogDemandes()
  }

  @HostListener('document:click', ['$event'])
  showMenuClickOutside(event : Event) {
    const target = event.target as HTMLElement
    if(!target.classList.contains('show-menu')) {
      this.showMenu.nativeElement.checked = false
    }
  }
}
