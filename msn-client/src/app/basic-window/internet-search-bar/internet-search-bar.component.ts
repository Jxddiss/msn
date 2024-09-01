import { Component, effect, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { URL_LIST } from '../../utils/ie-pages-list.util';

@Component({
  selector: 'app-internet-search-bar',
  templateUrl: './internet-search-bar.component.html',
  styleUrl: './internet-search-bar.component.css'
})
export class InternetSearchBarComponent implements OnInit{
  @Input() url : string = ""
  private _lastUrl : string = ""
  @Output() urlChange = new EventEmitter<string>()
  favoris : string[] = []
  @ViewChild('showMenu') showMenu !: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
    this.getRandomUrl()
    this.urlChange.emit(this.url)
    this.favoris = URL_LIST
  }

  onUrlChange(){
    this.urlChange.emit(this.url)
    this._lastUrl = this.url
  }

  onFavorisClick(url : string){
    if(!this.url.includes(url)){
      this.url = url
      this.urlChange.emit(this.url)
      this._lastUrl = this.url
    }else{
      this.onBack()
    }
  }

  onBack(){
    let lastUrlWithoutParams = ""
    const RandomParams = Math.floor(Math.random() * 100)
    if(this.url.includes("google")){
      lastUrlWithoutParams = this._lastUrl.split("&")[0]
      this.url = lastUrlWithoutParams + "&" + RandomParams
    }else{
      lastUrlWithoutParams = this._lastUrl.split("?")[0]
      this.url = lastUrlWithoutParams + "?" + RandomParams
    }
    
    this.urlChange.emit(this.url)
  }

  onNext(){
    this.getRandomUrl()
    this.urlChange.emit(this.url)
  }

  getRandomUrl(){
    const randomIndex = Math.floor(Math.random() * URL_LIST.length)
    const randomNumberUrlForceReload = Math.floor(Math.random() * 100)
    this.url = URL_LIST[randomIndex]
    if(this.url.includes("?")){
      this._lastUrl =this.url + "&" + randomNumberUrlForceReload
    }else{
      this._lastUrl =this.url + "?" + randomNumberUrlForceReload
    }
  }

  @HostListener('document:click', ['$event'])
  showMenuClickOutside(event : Event) {
    const target = event.target as HTMLElement
    if(!target.classList.contains('show-menu')) {
      this.showMenu.nativeElement.checked = false
    }
  }
}
