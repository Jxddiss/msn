import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import gsap from 'gsap';
import { WinksService } from '../../../../service/winks.service';
import { Wink } from '../../../../model/wink.model';
import { WINKS } from '../../../../utils/wink.utils';

@Component({
  selector: 'app-winks-picker',
  templateUrl: './winks-picker.component.html',
  styleUrl: './winks-picker.component.css'
})
export class WinksPickerComponent implements OnInit {
  @Input() open$ !: Observable<any>
  private _subscriptions : Subscription[] = []
  private _open = false

  constructor(private _winksService : WinksService){}

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
    this._winksService.onWinksToPlay(wink)
  }

  get winks(): Wink[] {
    return WINKS
  }
}
