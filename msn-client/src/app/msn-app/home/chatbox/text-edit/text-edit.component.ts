import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrl: './text-edit.component.css'
})
export class TextEditComponent implements OnInit, OnDestroy {
  @Input() open$ !: Observable<any>
  @ViewChild('fontSelector') fontSelector !: ElementRef
  private _subscriptions : Subscription[] = []
  private _open = false
  private _currentFontIndex = 0
  private _fonts : string[] = [
    'Segoe UI','Arial', 'Times New Roman', 
    'Roboto', 'Helvetica Neue', 
    'brush script mt', 'Verdana', 'sans-serif',
    'Courier New', 'Monospace',
    'Georgia', 'Impact', 'Palatino',
    'comic sans ms', 'papyrus',
  ]
  private _fontDebounce : NodeJS.Timeout | undefined
  private _textShadow = '1px 1px 1px black'
  style = {
    color: '',
    fontSize: '1rem',
    fontWeight: '',
    fontFamily: '',
    textShadow: 'none'
  }
  @Output() textEditedEvent = new EventEmitter<any>()

  constructor() {
    
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this.open$.subscribe(()=>this.onOpen())
    )
    this.textEditedEvent.emit(this.style)
  }

  onOpen() {
    if(!this._open){
      gsap.to('.edit-container', {
        display: 'flex',
        opacity: 1
      })
    }else{
      gsap.to('.edit-container', {
        display: 'none',
        opacity: 0
      })
    }
    this._open = !this._open
  }

  onColorChange($event: Event) {
    const color = ($event.target as HTMLInputElement).value
    this.style.color = color
  }

  onFontSizeChange($event: Event) {
    const fontSize = ($event.target as HTMLInputElement).value
    this.style.fontSize = fontSize + 'rem'
  }

  onFontWeightChange($event: Event) {
    const fontWeight = ($event.target as HTMLInputElement).value
    this.style.fontWeight = fontWeight
  }

  onTextShadowChange($event: Event) {
    const input = ($event.target as HTMLInputElement)
    if(!input.checked){
      this.style.textShadow = 'none'
    }else{
      this.style.textShadow = this._textShadow
    }
  }

  onScrollFont(direction: number) {
    if(this._fontDebounce) return
    this._fontDebounce = setTimeout(() => {
      this._fontDebounce = undefined
    }, 500)
    const fontSelector = this.fontSelector.nativeElement
    if(direction > 0){
      fontSelector.scrollBy({
        top: 0,
        left: fontSelector.clientWidth,
        behavior: 'smooth'
      })
      if(this._currentFontIndex < this._fonts.length - 1) this._currentFontIndex++
    }else{
      fontSelector.scrollBy({
        top: 0,
        left: -fontSelector.clientWidth,
        behavior: 'smooth'
      })
      if(this._currentFontIndex > 0) this._currentFontIndex--
    }
    this.style.fontFamily = this._fonts[this._currentFontIndex]
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(this._open){
      const target = event.target as HTMLElement
      if(!target.classList.contains('text-edit')){
          this.onOpen()
      }
    }
  }

  resetStyle(): void {
    this.style = {
      color: '',
      fontSize: '1rem',
      fontWeight: '',
      fontFamily: '',
      textShadow: 'none'
    }
    this._currentFontIndex = 0
    this.fontSelector.nativeElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
    this.textEditedEvent.emit(this.style)
  }

  get fonts() : string[] {
    return this._fonts
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._open = false
    this._currentFontIndex = 0
  }
}
