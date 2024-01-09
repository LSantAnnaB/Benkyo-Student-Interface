import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';

import { Users } from '../model/Users';
import { AuthService } from './auth.service';
import { ErrorMessageService } from './errorMessage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServeUrl: string = environment.apiServiceUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorMessageService: ErrorMessageService
  ) {}

  public addUser(user: Users): Observable<any> {
    return this.http.post<Users>(`${this.apiServeUrl}/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'addUser');
        return of([]);
      })
    );
  }

  public loginUser(user: Users): Observable<any> {
    return this.http.post<Users>(`${this.apiServeUrl}/login`, user).pipe(
      tap((res) => {
        const token = res.token;
        this.authService.setToken(token);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, 'loginUser');
        return of([]);
      })
    );
  }

  private handleError(error: HttpErrorResponse, operation: string) {
    console.error(`Erro na operação ${operation}:`, error);

    let errorMessage = this.getDefaultErrorMessage(operation);

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    }

    this.errorMessageService.showErrorMessage(errorMessage);
  }

  private getDefaultErrorMessage(operation: string): string {
    switch (operation) {
      case 'addUser':
        return 'Nível de permissão não autorizado para cadastar novo usuário.';
      case 'loginUser':
        return 'Ocorreu um erro ao fazer login. Usuario ou Senha inválidos';
      default:
        return 'Ocorreu um erro desconhecido.';
    }
  }
}
