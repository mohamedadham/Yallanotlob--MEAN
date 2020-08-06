import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../core/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestOrders=[]

  constructor(
    private ordersServ: OrdersService
  ) { }

  ngOnInit(): void {
    this.ordersServ.latestOrders().subscribe((orders)=> this.latestOrders= orders)
  }

}
