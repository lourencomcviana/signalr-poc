import {Observable, of, Subject, EMPTY, ReplaySubject, forkJoin} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, shareReplay, mergeMap, tap, pluck, map, mergeAll} from 'rxjs/operators';
import {HttpRequest} from '@angular/common/http';

export abstract class BaseTokenService {
  protected constructor(key: string) {
    this.currentToken = new Observable<Token>((observer) => {
      this.getStorage().subscribe(token => {
        if (token && !this.isExpired(token)) {
          console.log('token existe');
          observer.next(token);
          this.tokenChanged.next(token);
        } else {
          console.log('token não existe ou foi expirados, recuperando novo token');
          this.refreshToken().subscribe(newtoken => {
            observer.next(newtoken);
            this.tokenChanged.next(newtoken);
          });
        }
      });
    });
    this.tokenChanged.subscribe(t => console.log('token request'));
    this.tokenKey = key ?? 'token';
    this.tokenHelper = new JwtHelperService();
  }
  private readonly tokenHelper: JwtHelperService;
  protected readonly tokenKey;
  private readonly currentToken: Observable<Token>;
  private readonly tokenChanged = new ReplaySubject<Token>();

  public get(): Observable<Token> {
    return this.currentToken;
  }

  protected getStorage(): Observable<Token | null> {
    const res = localStorage.getItem(this.tokenKey);
    if (res) {
      try {
        const token = JSON.parse(res) as Token;
        return of(token);
      } catch (err: any) {
        console.error(err);
        localStorage.removeItem(this.tokenKey);
      }
    }
    return of(null);
  }
  protected setStorage(token: Token): Observable<any> {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
    return EMPTY;
  }

  public abstract shouldRun(request: HttpRequest<any>): boolean;
  /***
   * método que realiza a captura do tokens
   * @protected
   */
  protected abstract authenticate(): Observable<Token>;

  /***
   * Caso exista refresh tokent, tentar realizar o refresh com o refresh token sem alterar o token
   * @protected
   */
  protected abstract refresh(): Observable<Token>;


  public isExpired(token: Token): boolean {
    return this.tokenHelper.isTokenExpired(token.acess);
  }
  public refreshToken(): Observable<Token> {
    return this.getStorage()
      .pipe(mergeMap(tokenStorage => {
        if (tokenStorage != null && tokenStorage.refresh != null) {
          return of(tokenStorage as Token);
        } else {
          return this.authenticate().pipe(
            mergeMap(token => {
              return  forkJoin([of(token), this.setStorage(token)]);
            }),
            map(t => t[0] as Token));
        }
      }));
  }
}


export class TokenUtils {
  constructor() {  this.helper = new JwtHelperService(); }
  private  helper: JwtHelperService;

  decodeToken(token: string): any {
    return this.helper.decodeToken(token);
  }

  extractToken(token: string): string {
    const tokenExtracted = token.split(' ');
    return tokenExtracted[1];
  }

  getToken(token: string): string {
    return this.extractToken(token);
  }

  getTokenExpirationDate(token: any): Date | null {
    return this.helper.getTokenExpirationDate(token);
  }

  isTokenExpired(token: any): boolean {
    return this.helper.isTokenExpired(token);
  }
}

export class Token{

  constructor(token: string, expires: number, refresh?: string, type: string= 'Bearer') {
    this.acess = token;
    this.refresh = refresh;
    this.expires = expires;
    this.type = type;
  }
  // Token
  public acess: string;
  // Refresh Token se disponível
  public refresh?: string;
  // Tempo em segundos para a expiração do token
  public expires: number;
  // tipo de token
  public type: string;
}
