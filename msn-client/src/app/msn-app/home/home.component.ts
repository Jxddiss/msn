import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../../service/window-info.service';
import { AuthentificationService } from '../../service/authentification.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { RxStompService } from '../../service/rx-stomp.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('bannerImg') bannerImg!: ElementRef;

  loggedInUser: Utilisateur = {} as Utilisateur;

  constructor(
    private _windowInfoService: WindowInfoService,
    private _authentificationService: AuthentificationService,
    private _rxStompService: RxStompService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this._authentificationService.loggedUser)
      this.loggedInUser = this._authentificationService.loggedUser;
    this._windowInfoService.onHomeWindowOpen(true);
    this._rxStompService.publish({
      destination: '/app/user/status/' + this.loggedInUser.id,
      body: this.loggedInUser.statut,
    });
  }

  ngAfterViewInit(): void {
    this.positionAnimation();
    this._notificationService.getAllUnreadNotifications();
  }

  positionAnimation() {
    const tl = gsap.timeline();

    tl.to('.msn-window', {
      left: '20%',
    });
  }

  onBannerChangeEvent(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImg.nativeElement.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this._windowInfoService.onHomeWindowOpen(false);
    this._rxStompService.deactivate();
  }
}
