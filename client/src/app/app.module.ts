import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import  {HttpClientModule} from '@angular/common/http'
import {FormsModule,ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { fromEventPattern } from 'rxjs';
import { AuthService } from './core/auth.service';
import {AuthGuard} from './core/auth.guard';
import { FriendsComponent } from './friends/friends.component'
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsComponent } from './groups/groups.component';

import { SharedModule} from './shared/shared.module';
import { OrdersComponent } from './orders/add-order/orders.component';
import { ShowOrdersComponent } from './orders/show-orders/show-orders.component';
import { OrderComponent } from './orders/order/order.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotificationComponent } from './user/notification/notification.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component'

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    FriendsComponent,
    GroupsComponent,
    OrdersComponent,
    ShowOrdersComponent,
    OrderComponent,
    NotificationComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
