
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { TokenService } from '../services/authentication/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router} from '@angular/router';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor( private tokenService: TokenService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // return next.handle(request);
    if (!this.tokenService.shouldRun(request)) {
      return next.handle(request);
    }
    return this.tokenService.get().pipe(
      mergeMap(token => {
        // condições para aplicação do token aqui
        if (token) {
          const newReq = request.clone({
            setHeaders: {
              Authorization: `${token.type} ${token.acess}`
            }
          });

          return next.handle(newReq);
        } else {
          return next.handle(request);
        }
      }),
      catchError(err => {
        // tratamento de erros http
        return observableThrowError(err);
      })
    );
  }
}
