import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../../service/window-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('bannerImg') bannerImg !: ElementRef

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

  onBannerChangeEvent(file: File){
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImg.nativeElement.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this._windowInfoService.onHomeWindowOpen(false)
  }

}
