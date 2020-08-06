import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { AuthGuard } from './core/auth.guard';
import { FriendsComponent } from './friends/friends.component';
import { GroupsComponent } from './groups/groups.component';
import { OrdersComponent } from './orders/add-order/orders.component';
import { ShowOrdersComponent } from './orders/show-orders/show-orders.component';
import { OrderComponent } from './orders/order/order.component';
import { NotificationComponent } from './user/notification/notification.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path:'',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path:'login',
    component: SignInComponent
  },
  {
    path:'register',
    component: SignUpComponent,
  },
  {
    path:'friends',
    component: FriendsComponent,
    canActivate: [AuthGuard]

  },
  {
    path:'groups',
    component: GroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'order',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'orders',
    component: ShowOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'orders/:id',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'notifications',
    component: NotificationComponent,
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
