import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { ChatboxComponent } from './chatbox/chatbox.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('secondWindowContainer', { read: ViewContainerRef }) 
  secondWindowContainer: ViewContainerRef | undefined;

  constructor(private cdRef : ChangeDetectorRef){ }

  ngOnInit(): void {  
    
  }

  ngAfterViewInit(): void {
    this.initialiseChatBox()
    this.positionAnimation()
  }

  positionAnimation() {
    const tl = gsap.timeline();

    tl.to('.msn-window', {
      left: '20%',
    })

    tl.to('.second-window', {
      left: '50vw',
    })
  }

  ngOnDestroy(): void {
  }

  initialiseChatBox() {
    const componentRef = this.secondWindowContainer?.createComponent(ChatboxComponent);

    this.cdRef.detectChanges();
  }
}
