import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../model/Users';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServeUrl: string = environment.apiServiceUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public addUser(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiServeUrl}/register`, user);
  }
  public loginUser(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiServeUrl}/login`, user).pipe(
      tap((res) => {
        const token = res.token;
        this.authService.setToken(token);
      })
    );
  }
}
