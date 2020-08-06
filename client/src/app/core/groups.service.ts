import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { IGroup, IMember } from '../shared/interfaces'


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private _baseUrl= "http://localhost:3000/groups"

  constructor(private http: HttpClient) { }

  createGroup(name):Observable<any>{
    return this.http.post<any>(this._baseUrl,{name},{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  getGroups(name):Observable<any[]>{
    return this.http.get<any[]>(`${this._baseUrl}?name=${name}`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  getGroupMembers(id):Observable<any>{
    return this.http.get<any>(`${this._baseUrl}/${id}`,{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  addMemberToGroup(memberId, groupId){
    return this.http.post<any>(`${this._baseUrl}/${groupId}/member`,{member:memberId},{withCredentials: true}).pipe(
      catchError(this.handleError)
    )
  }

  removeMemberFromGroup(groupId,memberId){
    return this.http.put<any>(`${this._baseUrl}/${groupId}/${memberId}`,{member:memberId},{withCredentials: true}).pipe(
            catchError(this.handleError)
      )
  }

  deleteGroup(groupId){
    return this.http.delete<any>(`${this._baseUrl}/${groupId}`,{withCredentials: true}).pipe(catchError(this.handleError))
  }

  private handleError(error:any){
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return throwError(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
  }
  return throwError(error.error.message || 'Node.js server error');
  }


}
