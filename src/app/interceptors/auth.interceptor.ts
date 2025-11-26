import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { LoginService } from '../services/login.service';
import { ILoginType } from '../models/login-type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private loginService = inject(LoginService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (req.url.includes('users/')) {
      return next.handle(req);
    }

    const loginData = localStorage.getItem('login');
    let authReq = req;
    if (loginData) {
      var login = JSON.parse(loginData) as ILoginType;
      if (login.token) {
        authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${login.token}` }
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && loginData) {
          return this.loginService.refreshToken().pipe(
            switchMap((res) => {
              localStorage.setItem('login', JSON.stringify(res.data));
              const { accessToken } = res.data.token;
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` }
              });
              return next.handle(retryReq);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
