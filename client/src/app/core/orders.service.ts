import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  
  private _baseUrl = "http://localhost:3000/orders"
  
  constructor(private http: HttpClient) { }

  addOrderwithGroup(formData):Observable<any> {
    return this.http
      .post<any>(this._baseUrl, formData,{withCredentials: true}).pipe(
        catchError(this.handleError)
      )
  }

  addOrderwithFriends(formData):Observable<any> {
    return this.http
      .post<any>(this._baseUrl, formData,{withCredentials: true}).pipe(
        catchError(this.handleError)
      )
  }

  getOrders(page):Observable<any> {
    return this.http.get<any>(`${this._baseUrl}?page=${page}`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  finishOrder(orderId):Observable<any> {
    return this.http.patch<any>(`${this._baseUrl}/${orderId}/finish`,{},{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  cancelOrder(orderId):Observable<any> {
    return this.http.delete<any>(`${this._baseUrl}/${orderId}`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  getOrder(orderId):Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/${orderId}`,{withCredentials: true}).pipe(catchError(this.handleError))
  }

  addItemToOrder(formData, orderId):Observable<any>{
    return this.http.post<any>(`${this._baseUrl}/${orderId}/item`,formData,{withCredentials: true}).pipe(catchError(this.handleError))
  }

  removeItemFromOrder(itemId, orderId):Observable<any>{
    return this.http.delete<any>(`${this._baseUrl}/${orderId}/item/${itemId}`,{withCredentials: true}).pipe(catchError(this.handleError))
  }

  acceptRequest(orderId): Observable<any>{
    return this.http.patch<any>(`${this._baseUrl}/${orderId}`,{},{ withCredentials: true}).pipe(catchError(this.handleError))
  }

  rejectRequest(orderId): Observable<any>{
    return this.http.patch<any>(`${this._baseUrl}/${orderId}/reject`,{},{ withCredentials: true}).pipe(catchError(this.handleError))
  }


  latestOrders():Observable<any[]>{
    return this.http.get<any[]>(`${this._baseUrl}/latest`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
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
