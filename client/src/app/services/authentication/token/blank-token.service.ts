import {BaseTokenService, Token} from './base-token.service';
import {Observable, of} from 'rxjs';
import {HttpRequest} from '@angular/common/http';

export class BlankTokenService extends BaseTokenService {
  protected authenticate(): Observable<Token> {
    return of(
      new Token('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        300,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
    );
  }

  protected refresh(): Observable<Token> {
    return this.authenticate();
  }

  shouldRun(request: HttpRequest<any>): boolean {
    return true;
  }
}

