import { Employee } from './../model/employee';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  BASE_URL = environment.apiBaseUrl;
   

  constructor(private http: HttpClient) { }


  public getEmployees(): Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.BASE_URL}/employee/all`);
  }


 public addEmployee(employee: Employee): Observable<Employee>{
    return this.http.post<Employee>(`${this.BASE_URL}/employee/add`, employee);
 }
 

 
 public updateEmployee(employee: Employee): Observable<Employee>{
  return this.http.put<Employee>(`${this.BASE_URL}/employee/update`, employee);
}


public deleteEmployee(employeeId: number): Observable<void>{
   return this.http.delete<void>(`${this.BASE_URL}/employee/delete/${employeeId}`);
}
 


}
