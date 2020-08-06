import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/core/orders.service';
import { ToastrService } from 'ngx-toastr';

import{ IUser} from '../../shared/interfaces'
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.css']
})
export class ShowOrdersComponent implements OnInit {
  pager: any;
  orders: any[] = []
  currentUser: IUser;

  private basicUrl = 'http://localhost:3000/orders'

  constructor(
    private route: ActivatedRoute,
    private ordersServ: OrdersService,
    private toastr: ToastrService,
    private authenticationService: AuthService,

  ) { 
    this.pager = {}
    this.currentUser = this.authenticationService.currentUserValue;

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(x => this.loadPage(x.page || 1));
  }

  private loadPage(page) {
    this.ordersServ.getOrders(page).subscribe(x => {
      this.pager = x.pager;
      this.orders = x.orders;
    });
  }

  finishOrder(orderId) {
    this.ordersServ.finishOrder(orderId).subscribe(
      () =>{ 
        this.toastr.success("Order is finished")
        this.loadPage(this.pager.currentPage)
    },
      (err) => this.toastr.error(err.message))
  }

  cancelOrder(orderId) {
    this.ordersServ.cancelOrder(orderId).subscribe(
      () =>{ 
        this.toastr.success("Order is cancelled")
        this.loadPage(this.pager.currentPage)
    },
      (err) => this.toastr.error(err.message))
  }



}
