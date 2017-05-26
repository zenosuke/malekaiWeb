import { Component, ViewChild, ElementRef, HostListener,
        OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MalekaiService } from './services';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'malekai-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('elTop', { read: ElementRef }) _elTop: ElementRef;
  get elTop(): HTMLDivElement { return this._elTop ? this._elTop.nativeElement : null; }

  @ViewChild('elBottom', { read: ElementRef }) _elBottom: ElementRef;
  get elBottom(): HTMLDivElement { return this._elBottom ? this._elBottom.nativeElement : null; }

  top = 0;
  bottom = 0;

  nav: Array<{name: string, url: string}> = [
    { name: 'about', url: '/' },
    { name: 'projects', url: '/' },
    { name: 'help', url: '/' },
    { name: 'discord', url: '/' },
  ];

  tabs: Array<{name: string, url: string}> = [
    { name: 'all', url: '/' },
    { name: 'races', url: '/' },
    { name: 'classes', url: '/', },
    { name: 'disciplines', url: '/disciplines' },
    { name: 'powers', url: '/' },
    { name: 'tradeskills', url: '/' },
    { name: 'recipes', url: '/' },
  ];

  private subs: Subscription[] = [];

  constructor(private malekaiService: MalekaiService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.malekaiService.init();
    this.resize();
    const o = Observable.fromEvent(this.elTop, 'resize')
              .merge(Observable.fromEvent(this.elBottom, 'resize'))
              .merge(Observable.fromEvent(window, 'resize')).throttle(250 as any); // oh typings...
    this.subs.push(o.subscribe(() => this.resize()));
  }

  ngAfterViewInit() {
    this.resize(); // sigh
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  resize(): void {
    if(this.elTop) {
      this.top = this.elTop.offsetTop + this.elTop.offsetHeight;
    }
    if(this.elBottom) this.bottom = this.elBottom.getBoundingClientRect().height;
    this.changeDetector.detectChanges();
  }
}

/**
 * Yea the top bar will contain site navigation;
 * links to details about the api (about), the projects that use it (projects),
 * how to use the site (help) and details on the discord companion app (discord)
 * the second tier will be the "topics" we are gathering; races classes powers
 * disciplines tradeskills recipes
 * footer is important too
 * gotta put copyright and indicate ACE is letting us use this stuff notes
 */

