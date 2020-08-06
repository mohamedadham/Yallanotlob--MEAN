import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {Router} from '@angular/router'
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService, 
    private router: Router,
    private user: UserService
    
    ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.auth.isLoggedIn){
        return true
      }
      return this.user.isLoggedIn().pipe(map (res => {
        if(res.status){
          this.auth.setIsLoggedIn(true)
          return true
        }else{
          this.auth.logout().subscribe(()=>console.log(''))
          this.router.navigate['login']
          return false
        }
      }
      )
      
      )
  }
  
}
