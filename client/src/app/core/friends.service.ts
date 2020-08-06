import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IFriend } from '../shared/interfaces'

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private _getUserFriends="http://localhost:3000/users/friends"
  private _unfriend="http://localhost:3000/users/"
  private _addFriend="http://localhost:3000/users/friend"

  constructor(private http: HttpClient) { }

  getFriends(name): Observable<IFriend[]>{
    return this.http.get<IFriend[]>(`${this._getUserFriends}?name=${name}`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  unFriend(id): Observable<any>{
    return this.http.delete<any>(`${this._unfriend}${id}/friends `,{ withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }
  addFriend(email): Observable<any>{
    return this.http.post<any>(this._addFriend,{friendEmail: email},{ withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }



  private handleError(error: any) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        const errMessage = error.error.message;
        return throwError(errMessage);
        // Use the following instead if using lite-server
        // return Observable.throw(err.text() || 'backend server error');
    }
    return throwError(error.error.message || 'Node.js server error');
  }


}
