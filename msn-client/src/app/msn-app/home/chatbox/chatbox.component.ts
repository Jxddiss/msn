import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import gsap from 'gsap';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements OnInit,AfterViewInit, OnDestroy{
  private _isLoading = signal<boolean>(true)
  private _test : string | undefined

  constructor(private _windowInfoService : WindowInfoService) { }

  ngOnInit(): void {
    this._windowInfoService.onChatWindowOpen(true)
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  ngOnDestroy(): void {
    this._windowInfoService.onChatWindowOpen(false)
  }

  positionAnimation() {
    const tl = gsap.timeline();
    tl.to('.second-window', {
      left: '70%',
    })
  }

  setTest(value : string | undefined){
    this._test = value
    this._isLoading.set(false)
  }

  get isLoading(){
    return this._isLoading()
  }
}
