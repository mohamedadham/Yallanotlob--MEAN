import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import {Router} from "@angular/router"
import { SwPush } from '@angular/service-worker';
import { NotificationService } from './core/notification.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
 


  readonly VAPID_PUBLIC_KEY = "BFT1CBDhl_ch4lyiCLY4_aSSpQFEBrpGBO_Or7gAXU5BtwpD7yKjbsWeA0Xnzvn-i7LTH1XCHqXc0nqLIfV4khk";

  constructor(
    private swPush: SwPush,
    private notificationServices: NotificationService,

  ) {
    this.subscribeToNotifications()
  }


  subscribeToNotifications() {
    this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub =>{ console.log(sub);this.notificationServices.addPushSubscriber(sub).subscribe()})
    .catch(err => console.error("Could not subscribe to notifications", err));
  }
  

  
}
