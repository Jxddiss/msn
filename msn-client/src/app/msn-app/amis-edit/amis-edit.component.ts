import { Component, ElementRef, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-amis-edit',
  templateUrl: './amis-edit.component.html',
  styleUrl: './amis-edit.component.css'
})
export class AmisEditComponent {
  @ViewChild('dialogAjout') dialogAjout !: ElementRef
  @ViewChild('dialogInviter') dialogInviter !: ElementRef
  @ViewChild('dialogDemandes') dialogDemandes !: ElementRef
  private _subscriptions : Subscription[] = []

  constructor(private _windowInfoService : WindowInfoService) {

    this._subscriptions.push(
      this._windowInfoService.openDialogAjout$.subscribe(() => {
        this.onShowDialogAjout()
      })
    )

    this._subscriptions.push(
      this._windowInfoService.openDialogInviter$.subscribe(() => {
        this.onShowDialogInviter()
      })
    )

    this._subscriptions.push(
      this._windowInfoService.openDialogDemandes$.subscribe(() => {
        this.onShowDialogDemandes()
      })
    )
   }

  onShowDialogAjout() {
    this.dialogAjout.nativeElement.style.opacity = '1'
    this.dialogAjout.nativeElement.style.visibility = 'visible'
  }

  onHideDialogAjout() {
    this.dialogAjout.nativeElement.style.opacity = '0'
    this.dialogAjout.nativeElement.style.visibility = 'hidden'
  }

  onShowDialogInviter() {
    this.dialogInviter.nativeElement.style.opacity = '1'
    this.dialogInviter.nativeElement.style.visibility = 'visible'
  }

  onHideDialogInviter() {
    this.dialogInviter.nativeElement.style.opacity = '0'
    this.dialogInviter.nativeElement.style.visibility = 'hidden'
  }

  onShowDialogDemandes() {
    this.dialogDemandes.nativeElement.style.opacity = '1'
    this.dialogDemandes.nativeElement.style.visibility = 'visible'
  }

  onHideDialogDemandes() {
    this.dialogDemandes.nativeElement.style.opacity = '0'
    this.dialogDemandes.nativeElement.style.visibility = 'hidden'
  }

}
