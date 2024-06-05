import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor() { }

  ngOnInit(): void {  
    
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  positionAnimation() {
    const tl = gsap.timeline();

    tl.to('.window', {
      top: '50%',
      left: '20%',
    })
  }

  ngOnDestroy(): void {
  }
}
