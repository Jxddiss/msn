import { Component, effect, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { URL_LIST } from '../../utils/ie-pages-list.util';

@Component({
  selector: 'app-internet-search-bar',
  templateUrl: './internet-search-bar.component.html',
  styleUrl: './internet-search-bar.component.css'
})
export class InternetSearchBarComponent implements OnInit{
  hasPrevious : boolean = false
  @Input() url : string = ""
  @Input() secondLoadDone = signal(false)
  private _lastUrl : string = ""
  @Output() urlChange = new EventEmitter<string>()

  constructor() {
    effect(() => {
      if(this.secondLoadDone()){
        this.hasPrevious = true
      }
    })
  }

  ngOnInit(): void {
    this.getRandomUrl()
    this.urlChange.emit(this.url)
  }

  onUrlChange(){
    this.urlChange.emit(this.url)
    this._lastUrl = this.url
  }

  onBack(){
    if(!this.hasPrevious){
      return
    }
    console.log("last url "+this._lastUrl)
    this.urlChange.emit(this._lastUrl)
    this.url = this._lastUrl
    console.log("current url "+this.url)
  }

  onNext(){
    this.getRandomUrl()
    this.urlChange.emit(this.url)
    this.hasPrevious = true
  }

  getRandomUrl(){
    const randomIndex = Math.floor(Math.random() * URL_LIST.length)
    const randomNumberUrlForceReload = Math.random() * 100
    this.url = URL_LIST[randomIndex]
    if(this.url.includes("?")){
      this._lastUrl =this.url + "&" + randomNumberUrlForceReload
    }else{
      this._lastUrl =this.url + "?" + randomNumberUrlForceReload
    }
  }
}
