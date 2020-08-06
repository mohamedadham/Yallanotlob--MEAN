import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _baseUrl= `http://localhost:3000`

  constructor(
    private http: HttpClient
  ) { }

  addPushSubscriber(sub:any) {
    return this.http.post(`${this._baseUrl}/notifications`, sub, {withCredentials: true});
  }

  getNotifications(): Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/users/notifications` ,{ withCredentials: true})
  }

  

}
