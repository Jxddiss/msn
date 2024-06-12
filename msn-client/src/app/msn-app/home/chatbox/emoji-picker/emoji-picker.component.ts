import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import gsap from 'gsap';
import { Observable, Subscription } from 'rxjs';
import { EMOJIS } from '../../../../utils/emoji.utils';
import { Emoji } from '../../../../model/emoji.model';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.css'
})
export class EmojiPickerComponent implements OnInit {
  @Input() open$ !: Observable<any>
  private _subscriptions : Subscription[] = []
  private _open = false
  @Output() emojiSelected = new EventEmitter<string>()

  constructor(){}

  ngOnInit(): void {
    this._subscriptions.push(
      this.open$.subscribe(()=>this.onOpen())
    )
  }

  onOpen() {
    if(!this._open){
      gsap.to('.emoji-container', {
        display: 'flex',
        opacity: 1
      })
    }else{
      gsap.to('.emoji-container', {
        display: 'none',
        opacity: 0
      })
    }
    this._open = !this._open
  }

  onEmojiClick(emoji: Emoji) {
    this.emojiSelected.emit(emoji.code)
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(this._open){
      const target = event.target as HTMLElement
      if(!target.classList.contains('emoji')
        && !target.classList.contains('opt')){
          this.onOpen()
      }
    }
  }

  get emojis() {
    return EMOJIS
  }
}
