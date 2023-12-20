import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../model/Student';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiServeUrl: string = environment.apiServiceUrl;

  constructor(private http: HttpClient) {}

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
}
