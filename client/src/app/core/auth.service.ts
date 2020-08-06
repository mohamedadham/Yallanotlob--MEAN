import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';


import { IUser } from '../shared/interfaces'
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router"

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _registerUrl = "http://localhost:3000/users/signup"
  private _loginUrl = "http://localhost:3000/users/login"
  private _logoutUrl = "http://localhost:3000/users/logout"


  isLoggedInStatus = false

  private currentUserSubject: BehaviorSubject<IUser>;
  currentUser: Observable<IUser>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
    
    ) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }


  setIsLoggedIn(value: boolean) {
    this.isLoggedInStatus = value;
  }

  get isLoggedIn() {
    return this.isLoggedInStatus;
  }

  registerUser(name, email, password,image) {
    return this.http.post<any>(this._registerUrl, { name, email, password, image }).pipe(
    catchError(this.handleError)
    );
  }

  loginUser(email, password) {
    return this.http.post<any>(this._loginUrl, { email, password }, { withCredentials: true }).pipe(map(resp => {
      localStorage.setItem('currentUser', JSON.stringify(resp.user));
      this.currentUserSubject.next(resp.user);
      this.isLoggedInStatus= false
      return resp.user;
    }),
    catchError(this.handleError)
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    return this.http.get<any>(this._logoutUrl, { withCredentials: true }).pipe(map(resp => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.isLoggedInStatus= false
      return true;
    }),
    catchError(this.handleError)
    );
  } 

  private handleError(error: any) {
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return throwError(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return throwError(error.error.message || 'Server error');
  }

}
