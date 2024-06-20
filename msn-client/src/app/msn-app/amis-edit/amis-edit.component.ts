import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Subscription } from 'rxjs';
import { AuthentificationService } from '../../service/authentification.service';
import { DemandeService } from '../../service/demande.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-amis-edit',
  templateUrl: './amis-edit.component.html',
  styleUrl: './amis-edit.component.css'
})
export class AmisEditComponent implements OnInit, OnDestroy {
  @ViewChild('dialogAjout') dialogAjout !: ElementRef
  @ViewChild('dialogInviter') dialogInviter !: ElementRef
  @ViewChild('dialogDemandes') dialogDemandes !: ElementRef
  private _demandes : any[] = []
  private _subscriptions : Subscription[] = []
  loggedId : number = 0

  constructor(
    private _windowInfoService : WindowInfoService,
    private _authentificationService : AuthentificationService,
    private _demandeService : DemandeService
  ) {

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

    this._subscriptions.push(
      this._demandeService.demandes$.subscribe((demandes) => {
        this._demandes = demandes
      })
    )
  }

  ngOnInit(): void {
    this.loggedId = this._authentificationService.loggedUser?.id!
    this._demandeService.getDemandes(this._authentificationService.loggedUser?.id!)
  }

  get demandes() : any[] {
    return this._demandes
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

  onSendDemande(form : NgForm) {
    if (form.valid) {
      const formData = new FormData()
      formData.append('emailReceveur', form.value.email)
      formData.append('emailEmetteur', this._authentificationService.loggedUser?.email!)
      this._demandeService.sendDemande(formData)
      form.reset()
      this.onHideDialogAjout()
    }
  }

  onAccepterDemande(demandeId : number) {
    this._demandeService.acceptDemande(demandeId)
  }

  onRefuserDemande(demandeId : number) {
    this._demandeService.refuseDemande(demandeId)
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._demandeService.cleanUp()
  }

}
