import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface isLoggedIn{
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _isLoggedIn="http://localhost:3000/users/isloggedin"

  constructor(private http: HttpClient) { }

  isLoggedIn(): Observable<isLoggedIn>{
    return this.http.get<isLoggedIn>(this._isLoggedIn,{ withCredentials: true })
  }
}
