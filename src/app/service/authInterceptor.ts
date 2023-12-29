import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private service: TokenService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const meuToken = this.service.getToken();
    if (meuToken !== null) {
      const authResquest = req.clone({
        setHeaders: { Authorization: `Bearer ${meuToken}` },
      });

      return next.handle(authResquest);
    }

    return next.handle(req);
  }
}
