import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { Student } from 'src/app/model/Student';
import { StudentService } from 'src/app/service/student.service';
import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';
import { ErrorMessageService } from 'src/app/service/errorMessage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  public students: Student[] = [];
  public editStudent: Student = new Student();
  public deleteStudent: Student = new Student();

  errorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    private errorMessageService: ErrorMessageService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  public getStudents(): void {
    this.studentService.getStudents().subscribe(
      (res: Student[]) => {
        this.students = res;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchStudents(key: string): void {
    console.log(key);
    const results: Student[] = [];
    for (const student of this.students) {
      if (
        student.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.shift.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.course.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.responsible.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.data.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        student.contractTime.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(student);
      }
    }
    this.students = results;
    if (results.length === 0 || !key) {
      this.getStudents();
    }
  }

  public onOpenModal(student: Student, mode: string): void {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode == 'add') {
      button.setAttribute('data-target', '#addStudentModal');
    }

    if (mode == 'edit') {
      this.editStudent = student;
      button.setAttribute('data-target', '#updateStudentModal');
    }

    if (mode == 'delete') {
      this.deleteStudent = student;
      button.setAttribute('data-target', '#deleteStudentModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddStudent(addForm: NgForm): void {
    document.getElementById('add-student-form')?.click();
    this.studentService
      .addStudent(addForm.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          alert(error.message);
          throw error;
        })
      )
      .subscribe((response: Student) => {
        this.getStudents();
        addForm.reset();
      });
  }
  public onUpdateStudent(student: Student): void {
    this.studentService
      .updateStudent(student)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          alert(error.message);
          throw error;
        })
      )
      .subscribe((response: Student) => {
        this.getStudents();
      });
  }

  public onDownloadExcel(): void {
    this.studentService
      .downloadExcelFile()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erro ao baixar o arquivo Excel:', error);
          throw error;
        })
      )
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }

  public onUploadExcel(): void {
    if (this.file) {
      this.studentService.uploadExcelFile(this.file).subscribe(
        (response: Blob) => {
          this.getStudents();
        },
        (error: HttpErrorResponse) => {
          // Exibe o erro na tela
          alert(
            `O Arquivo precisa ter todas as colunas necessárias da tabela.\n\nO Arquivo precisa ter o formato xlsx`
          );
        }
      );
    }
  }

  public onDeleteStudent(studetId: number): void {
    this.studentService
      .deleteStudent(studetId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          alert(error.message);
          throw error;
        })
      )
      .subscribe((response: void) => {
        this.getStudents();
      });
  }

  public file: File | null = null;

  public onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }

  redirectToLogin() {
    this.router.navigate(['']);
  }

  public errorOccurred = false;
  public erroMessage = '';
  @ViewChild('errorContainer') errorContainer!: ElementRef;

  ngOnInit() {
    this.getStudents();
    this.errorMessageService.errorMessage$.subscribe((message) => {
      this.errorMessage = message;
    });
  }
}
