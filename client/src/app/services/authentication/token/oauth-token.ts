import {BaseTokenService, Token} from './base-token.service';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/operators';

export class Oauthtoken extends BaseTokenService {
  constructor(private http: HttpClient, private key: string, private readonly baseUrl: string) {
    super(key);
  }
  protected authenticate(): Observable<Token> {
    return this.http.post<any>(`${this.baseUrl}/token`, {}).pipe(
      map(token => this.mapHttpToken(token))
    );
  }

  protected refresh(): Observable<Token> {
    return this.authenticate();
  }
  // rodar para todos que não forem a url de oauth
  shouldRun(request: HttpRequest<any>): boolean {
    return !request.url.startsWith(this.baseUrl);
  }

  mapHttpToken(token: any): Token{
    return {
      acess: token.acess_token,
      refresh: token.refresh_token,
      expires: token.expires_in,
      type: token.token_type
    };
  }
}

