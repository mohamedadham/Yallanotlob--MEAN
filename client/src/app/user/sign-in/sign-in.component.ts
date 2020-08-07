import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import {Router} from '@angular/router'
import{NgForm} from '@angular/forms'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  notExist= false;
  constructor(private _auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // loginUser(){
  //   this._auth.loginUser(this.loginUserData.email,this.loginUserData.password)
  //   .subscribe(
  //     res => {
  //       console.log(res)
  //       this.router.navigate([''])
  //       this._auth.setIsLoggedIn(true)
  //     },
  //     err => window.alert(err.error.error)
  //   )
  // }

  onSubmit(f: NgForm) {
    if(f.valid){
      this._auth.loginUser(f.value.email,f.value.password)
    .subscribe(
      res => {
        this.router.navigate([''])
        this._auth.setIsLoggedIn(true)
      },
      err => this.notExist=true
    )
    }
  }

}
