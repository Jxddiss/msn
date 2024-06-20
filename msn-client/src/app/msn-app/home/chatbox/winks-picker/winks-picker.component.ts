import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import gsap from 'gsap';
import { Wink } from '../../../../model/wink.model';
import { WINKS } from '../../../../utils/wink.utils';
import { Message } from '../../../../model/message.model';
import { RxStompService } from '../../../../service/rx-stomp.service';

@Component({
  selector: 'app-winks-picker',
  templateUrl: './winks-picker.component.html',
  styleUrl: './winks-picker.component.css'
})
export class WinksPickerComponent implements OnInit, OnDestroy {
  @Input() open$ !: Observable<any>
  @Input() conversationId !: number
  private _subscriptions : Subscription[] = []
  private _open = false
  private loggedUser = JSON.parse(localStorage.getItem('utilisateur')!)

  constructor(
    private _rxStompService : RxStompService
  ){}

  ngOnInit(): void {
    this._subscriptions.push(
      this.open$.subscribe(()=>this.onOpen())
    )
  }

  onOpen() {
    if(!this._open){
      gsap.to('.winks-container', {
        display: 'flex',
        opacity: 1
      })
    }else{
      gsap.to('.winks-container', {
        display: 'none',
        opacity: 0
      })
    }
    this._open = !this._open
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(this._open){
      const target = event.target as HTMLElement
      if(!target.classList.contains('wink')){
          this.onOpen()
      }
    }
  }

  onWinkClick( wink: Wink) {
    const message = new Message(0,'',new Date(),this.loggedUser.nomComplet,'wink',{id:this.conversationId},null,wink.imgPreview)
    this._rxStompService.publish({
      destination: '/app/chat/' + this.conversationId,
      body: JSON.stringify(message)
    })
  }

  get winks(): Wink[] {
    return WINKS
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
