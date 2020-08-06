import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import {Router} from "@angular/router"
import { SwPush } from '@angular/service-worker';
import { NotificationService } from './core/notification.service';
import { UserService } from './core/user.service';
import { map, catchError } from 'rxjs/operators'
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {IUser} from './shared/interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  faNotification = faBell;
  currentUser: IUser={name:'', _id:'', email:'', friends:[], image:''};


  readonly VAPID_PUBLIC_KEY = "BFT1CBDhl_ch4lyiCLY4_aSSpQFEBrpGBO_Or7gAXU5BtwpD7yKjbsWeA0Xnzvn-i7LTH1XCHqXc0nqLIfV4khk";

  constructor(
    private authServ: AuthService,
    private router: Router,
    private swPush: SwPush,
    private notificationServices: NotificationService,
    private userService: UserService

  ) {
    console.log(this.authServ.currentUserValue)
    this.currentUser = this.authServ.currentUserValue;
    console.log(this.currentUser)

    this.subscribeToNotifications()
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

  subscribeToNotifications() {
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub =>{ console.log(sub);this.notificationServices.addPushSubscriber(sub).subscribe()})
    .catch(err => console.error("Could not subscribe to notifications", err));
  }
  

  
}
