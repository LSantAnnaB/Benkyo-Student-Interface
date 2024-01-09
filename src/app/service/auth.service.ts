import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Subject } from 'rxjs';
import { UserInterface } from './../model/UserInterface';

import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new Subject<UserInterface | null>();
  constructor(private tokenService: TokenService) {
    this.tokenService.hasToken() && this.decodeAndNotify();
  }

  setToken(token: any) {
    this.tokenService.setToken(token);
    this.decodeAndNotify();
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  private decodeAndNotify() {
    const token: any = this.tokenService.getToken();
    const user = jwtDecode(token) as UserInterface;
    this.userSubject.next(user);
  }

  logout() {
    this.tokenService.removeToken();
    this.userSubject.next(null);
  }
}
