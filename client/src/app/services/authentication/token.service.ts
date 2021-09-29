import {Injectable} from '@angular/core';
import Constants from '../../classes/Constants';
import {Oauthtoken} from './token/oauth-token';
import {HttpClient, HttpRequest} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TokenService extends Oauthtoken {
  constructor(http: HttpClient) {
    super(http, 'token', Constants.OAUTH_BASE_URL);
  }
}
