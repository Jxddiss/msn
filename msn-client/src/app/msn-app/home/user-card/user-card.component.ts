import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ErreurService } from '../../../service/erreur.service';
import { Erreur } from '../../../model/erreur.model';
import { verifyFile } from '../../../utils/input-verification.utils';
import { Utilisateur } from '../../../model/utilisateur.model';
import { AuthentificationService } from '../../../service/authentification.service';
import { Router } from '@angular/router';
import { WindowInfoService } from '../../../service/window-info.service';
import { UtilisateurService } from '../../../service/utilisateur.service';
import { RxStompService } from '../../../service/rx-stomp.service';
import { NgForm } from '@angular/forms';
import { ConversationService } from '../../../service/conversation.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent implements OnInit {
  @ViewChild('avatarPicker') avatarPicker!: ElementRef;
  @ViewChild('avatarImg') avatarImg!: ElementRef;
  @ViewChild('bannerPicker') bannerPicker!: ElementRef;
  @Output() bannerChangeEvent = new EventEmitter<File>();
  loggedInUser: Utilisateur = {} as Utilisateur;
  previousStatus: string = '';
  private _avatarFile: File | null = null;
  private _bannerFile: File | null = null;

  constructor(
    private _erreurService: ErreurService,
    private _authentificationService: AuthentificationService,
    private _router: Router,
    private _windowInfoService: WindowInfoService,
    private _utilisateurService: UtilisateurService,
    private _rxStompService: RxStompService,
    private _conversationService: ConversationService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this._authentificationService.loggedUser)
      this.loggedInUser = this._authentificationService.loggedUser;
    this.previousStatus = this.loggedInUser.statut;
  }

  onChooseAvatar() {
    this.avatarPicker.nativeElement.click();
  }

  onChooseBanner() {
    this.bannerPicker.nativeElement.click();
  }

  onAvatarImgChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      let result = verifyFile(file);
      if (result === 'bon') {
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarImg.nativeElement.src = reader.result as string;
        };
        reader.readAsDataURL(file);
        this._avatarFile = file;
      } else {
        const erreur = new Erreur('avatar', result);
        this._erreurService.onErreursEvent(erreur);
        this.avatarPicker.nativeElement.value = '';
      }
    }
  }

  onBannerImgChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      let result = verifyFile(file);
      if (result === 'bon') {
        this.bannerChangeEvent.emit(file);
        this._bannerFile = file;
      } else {
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
        this.bannerPicker.nativeElement.value = '';
      }
    }
  }

  onStatutChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.loggedInUser.statut = target.value;
  }

  onLogout() {
    this._authentificationService.setDisconnected();
    this._windowInfoService.onDisparition();
    this._windowInfoService.onChatWidowMinimizeOrResume();
    this._notificationService.cleanUp();
    this.loggedInUser.statut = 'disconnected';
    this.sendStatus();
    setTimeout(() => {
      this._conversationService.cleanUp();
      this._authentificationService.logout();
      this._router.navigate(['/login']);
    }, 500);
  }

  onUpdateUser(userForm: NgForm) {
    if (userForm.invalid) return;
    const formData = this._utilisateurService.createFormData(
      this.loggedInUser,
      this._avatarFile,
      this._bannerFile
    );
    this._utilisateurService
      .updateUtilisateur(formData, this.loggedInUser.id)
      .subscribe({
        next: (response) => {
          this._authentificationService.addUserToLocalStorage(response.body!);
          if (this.previousStatus !== this.loggedInUser.statut) {
            this.sendStatus();
          }
          this.previousStatus = this.loggedInUser.statut;
          this._authentificationService.updateLoggedUser();
          this._bannerFile = null;
          this._avatarFile = null;
        },
        error: (err) => {
          const erreur = new Erreur("Update de l'utilisateur", err.message);
          this._erreurService.onErreursEvent(erreur);
        },
      });
  }

  sendStatus() {
    this._rxStompService.publish({
      destination: '/app/user/status/' + this.loggedInUser.id,
      body: this.loggedInUser.statut,
    });
  }
}
