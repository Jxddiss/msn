import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../../service/window-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private _windowInfoService : WindowInfoService){ }

  ngOnInit(): void {
    this._windowInfoService.onHomeWindowOpen(true)
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

  ngOnDestroy(): void {
    this._windowInfoService.onHomeWindowOpen(false)
  }

}
