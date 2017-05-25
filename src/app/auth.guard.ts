import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MalekaiService } from './services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private malekaiService: MalekaiService) {

  }

  private check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.malekaiService.initialized ?
                this.check(route, state) :
                this.malekaiService.onInit.map(() => this.check(route, state)); // cheap! haha
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return this.canActivate(route, state);
  }

}
