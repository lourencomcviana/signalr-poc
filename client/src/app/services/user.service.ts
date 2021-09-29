import {Injectable} from '@angular/core';
import Apis from '../classes/Constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService  {
  constructor(private http: HttpClient) {
  }
  public getUser(): Observable<any> {
    return this.http.get<any>(`${Apis.USER_API}/users`);
  }
}
