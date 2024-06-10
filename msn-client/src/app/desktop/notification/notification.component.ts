import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('notification') notification !: ElementRef
  close = new EventEmitter()
  destroyTimeout : NodeJS.Timeout | undefined


  ngAfterViewInit(): void {
    this.apparition()
    this.destroyTimeout = setTimeout(()=>{
      this.onClose()
    },7000)
  }

  onClose(){
    this.close.emit()
  }

  apparition(){
    const el = this.notification.nativeElement

    gsap.fromTo(el,{
      opacity:0.5,
      translateX: '100%',
    },{
      opacity:1,
      translateX: '0%',
      duration: 0.5,
      ease: 'power1.inOut'
    })
  }

  disparition(){
    const el = this.notification.nativeElement
    gsap.to(el,{
      opacity:0,
      translateX: '100%',
      duration: 0.5,
      ease: 'power1.inOut'
    })
  }

  ngOnDestroy(): void {
    if(this.destroyTimeout){
      clearTimeout(this.destroyTimeout)
    }
  }
}
