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
  currentFontIndex = 0
  fonts : string[] = [
    'Arial', 'Times New Roman', 
    'Segoe UI', 'Roboto', 'Helvetica Neue', 
    'brush script mt', 'Verdana', 'sans-serif',
    'Courier New', 'Monospace',
    'Georgia', 'Impact', 'Palatino',
    'comic sans ms', 'papyrus',
  ]
  textShadow = '1px 1px 1px black'
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
      this.style.textShadow = this.textShadow
    }
  }

  onScrollFont(direction: number) {
    const fontSelector = this.fontSelector.nativeElement
    if(direction > 0){
      fontSelector.scrollBy({
        top: 0,
        left: fontSelector.clientWidth,
        behavior: 'smooth'
      })
      if(this.currentFontIndex < this.fonts.length - 1) this.currentFontIndex++
    }else{
      fontSelector.scrollBy({
        top: 0,
        left: -fontSelector.clientWidth,
        behavior: 'smooth'
      })
      if(this.currentFontIndex > 0) this.currentFontIndex--
    }
    this.style.fontFamily = this.fonts[this.currentFontIndex]
  }

  onSave() {
    this.textEditedEvent.emit(this.style)
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

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._open = false
    this.currentFontIndex = 0
  }
}
