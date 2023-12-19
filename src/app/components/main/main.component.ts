import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs';
import { Student } from 'src/app/model/Student';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  public students: Student[] = [];
  public editStudent!: Student;
  public deleteStudent!: Student;

  constructor(private studentService: StudentService) {}

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
    this.studentService.updateStudent(student).subscribe(
      (respose: Student) => {
        this.getStudents();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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

  public OnDownloadExcel(): void {
    this.studentService.downloadExcelFile().subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao baixar o arquivo Excel:', error);
      }
    );
  }

  ngOnInit() {
    this.getStudents();
  }
}
