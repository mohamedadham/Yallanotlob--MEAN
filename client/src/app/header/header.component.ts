import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { map, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import{ IUser, } from '../shared/interfaces'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faNotification = faBell;
  currentUser: IUser={name:'', _id:'', email:'', friends:[], image:''};

  constructor(
    private authServ: AuthService,
    private userService: UserService,
    private router: Router
  ) { 
    this.currentUser = this.authServ.currentUserValue;

  }

  ngOnInit(): void {
  }


  isLoggedIn(){

    if(this.authServ.isLoggedIn){
      return true
    }
    this.userService.isLoggedIn().pipe(map (res => {
      if(res.status){
        this.authServ.setIsLoggedIn(true)
        return true
      }else{
        this.authServ.logout().subscribe(()=>console.log(''))
        this.router.navigate['login']
        return false
      }
    }
    )
    
    )
  }

  logout(){
    return this.authServ.logout().subscribe(()=>this.router.navigate(['/login']),()=>this.router.navigate(['/login']) )
  }

}
