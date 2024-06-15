import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../../service/window-info.service';
import { ConversationService } from '../../service/conversation.service';
import { Conversation } from '../../model/conversation.model';
import { AuthentificationService } from '../../service/authentification.service';
import { Utilisateur } from '../../model/utilisateur.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('bannerImg') bannerImg !: ElementRef
  loggedInUser : Utilisateur = {} as Utilisateur;

  constructor(
    private _windowInfoService : WindowInfoService,
    private _authentificationService : AuthentificationService
  ){ }

  ngOnInit(): void {
    this._windowInfoService.onHomeWindowOpen(true)
    if(this._authentificationService.loggedUser)
    this.loggedInUser = this._authentificationService.loggedUser
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  positionAnimation() {
    const tl = gsap.timeline();

    tl.to('.msn-window', {
      left: '20%',
    })
  }

  onBannerChangeEvent(file: File){
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImg.nativeElement.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this._windowInfoService.onHomeWindowOpen(false)
  }

}
