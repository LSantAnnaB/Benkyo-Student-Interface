import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Users } from 'src/app/model/Users';
import { ErrorMessageService } from 'src/app/service/errorMessage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private user: UserService,
    private router: Router,
    private errorMessageService: ErrorMessageService
  ) {}

  public onOpenModal(users: Users, mode: string): void {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode == 'add') {
      button.setAttribute('data-target', '#addUserModal');
    }
    if (mode == 'login') {
      button.setAttribute('data-target', '#loginUserModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddUser(addForm: NgForm): void {
    document.getElementById('add-user-form')?.click();
    this.user
      .addUser(addForm.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          alert(error.message);
          throw error;
        })
      )
      .subscribe((response: Users) => {
        addForm.reset();
      });
  }
  public onLoginUser(loginForm: NgForm): void {
    document.getElementById('login-user-form')?.click();
    this.user
      .loginUser(loginForm.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          alert(error.message);
          return throwError(() => error);
        })
      )
      .subscribe((response: Users) => {
        loginForm.reset();
        this.router.navigate(['/main']);
      });
  }

  redirectToMain() {
    this.router.navigate(['/main']);
  }
  clearErrorMessage() {
    this.errorMessage = '';
  }
  ngOnInit() {
    this.errorMessageService.errorMessage$.subscribe((message) => {
      this.errorMessage = message;
    });
  }
}
