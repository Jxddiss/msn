import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.css'
})
export class TaskbarComponent implements OnDestroy{
  @Input() msnOpened = false
  @Output() msnOpenEvent = new EventEmitter()
  @ViewChild('startMenu') startMenu : ElementRef | undefined
  @ViewChild('startIcon') startIcon : ElementRef | undefined
  startOpened = false
  currentDate = new Date();
  intervalDate = setInterval(() => {
    this.currentDate = new Date();
  }, 1000);
  chatOpened = false
  private _subcriptions : Subscription[] = []
  
  constructor(private _windowInfoService : WindowInfoService){ 
    this._subcriptions.push(
      this._windowInfoService.chatWindowOpen$.subscribe(value => {
        this.chatOpened = value
      })
    )
  }

  onMsnOpen(){
    this.msnOpenEvent.emit(null)
  }

  onOpenStartMenu(){
    this.startMenu?.nativeElement.classList.toggle('open')
    this.startIcon?.nativeElement.classList.toggle('start-icon-active')
    this.startOpened = !this.startOpened
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    if(!this.startMenu?.nativeElement.contains(event.target as Node) 
      && !this.startIcon?.nativeElement.contains(event.target as Node)){
      if(this.startOpened) this.onOpenStartMenu()
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalDate);
  }
}
