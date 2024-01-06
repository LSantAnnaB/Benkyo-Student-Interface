import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../model/Student';
import { environment } from 'src/environments/environment';
import { ErrorMessageService } from './errorMessage.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiServeUrl: string = environment.apiServiceUrl;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {}

  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiServeUrl}/student/all`);
  }

  public addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiServeUrl}/student/add`, student);
  }
  public updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(
      `${this.apiServeUrl}/student/update`,
      student
    );
  }
  public deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServeUrl}/student/delete/${studentId}`
    );
  }
  public downloadExcelFile(): Observable<Blob> {
    return this.http.get(`${this.apiServeUrl}/student/excel`, {
      responseType: 'blob',
    });
  }

  public uploadExcelFile(file: File): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiServeUrl}/student/upload`, formData, {
      responseType: 'blob',
    });
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
