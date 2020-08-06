import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/notification.service';
import { OrdersService } from 'src/app/core/orders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications:any[]
  constructor(
    private notificationsServ: NotificationService,
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.notificationsServ.getNotifications().subscribe((notifications)=> this.notifications= notifications)
  }

  acceptRequest(orderId){
    this.ordersService.acceptRequest(orderId).subscribe(()=>this.ngOnInit(),(err)=>this.toastr.error(err))
  }

  rejectRequest(orderId){
    this.ordersService.rejectRequest(orderId).subscribe(()=>this.ngOnInit(),(err)=>this.toastr.error(err))
  }

}
