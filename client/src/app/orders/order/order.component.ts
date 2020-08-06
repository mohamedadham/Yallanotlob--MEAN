import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/core/orders.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';


import { AuthService } from 'src/app/core/auth.service';
import { IUser } from '../../shared/interfaces'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order: any = { items: [] };
  id: string;
  currentUser: IUser;

  fadelete = faMinusCircle;


  constructor(
    private ordersServ: OrdersService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authenticationService: AuthService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    
    this.ordersServ.getOrder(this.id)
    .subscribe((order) => this.order = order.order, (err) => this.toastr.error(err.message))
  }

  addItemToOrder(f: NgForm) {

    this.ordersServ.addItemToOrder(f.value, this.id)
      .subscribe(() => {
        this.toastr.success("item is added"); f.reset(), this.ngOnInit()
      }, (err) => this.toastr.error(err)
      )

  }

  removeItemFromOrder(itemId) {
    this.ordersServ.removeItemFromOrder(itemId, this.id).subscribe(() => {
      this.toastr.success("item is removed");
      this.ngOnInit()
    }, (err) => {
      this.toastr.error(err.message)
    }
    )
  }

}
