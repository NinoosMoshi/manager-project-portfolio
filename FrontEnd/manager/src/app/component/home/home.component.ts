import { ChartType } from './../../enum/chart-type';
import { ManagerService } from './../../service/manager.service';
import { Employee } from './../../model/employee';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public employees: Employee[];
  public editEmployee:Employee;
  public deleteEmployee: Employee;
  public viewEmployee: any;
  public pageSize = 3;
  public page = 1;
  pageSizes = [3, 6, 9];


  public male: any[] = [];
  public female: any[] = [];
  public traceList: any[];
  public httpDefaultTraces: any[] = [];
  



  constructor(private service: ManagerService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void{
    this.service.getEmployees().subscribe(
      (response: Employee[]) =>{

      for(let temp in response){
        // console.log(temp)
        // console.log(response[temp].gender)
       this.employees= response
       this.processTraces(response[temp].gender);
       this.initializeBarChart();
       this.initializePieChart();
      }      
      },
      (error: HttpErrorResponse) =>{
       alert(error.message);
      }
    );

 }


 processTraces(trace: string){
    switch(trace){
      case 'male':
        this.male.push(trace);
        break;

      case 'female':
        this.female.push(trace);
        break;
        
      default:
        this.httpDefaultTraces.push(trace);  
    }
 }



 private initializeBarChart(): Chart {
  const element = document.getElementById('barChart');
  return new Chart(element, {
    type: ChartType.BAR,
    data: {
        labels: [`# Male:${this.male.length}, Percent:${(this.male.length / (this.male.length+this.female.length)) * 100}%`,
                 `# Female:${this.female.length}, Percent:${(this.female.length / (this.male.length+this.female.length)) * 100}%`],
        datasets: [{data: [this.male.length, this.female.length],
            backgroundColor: [ 'rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 3
        }]
    },
    options: {
      title: { display: true, text: 'bar chart' },
      legend: { display: false },
      scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}


private initializePieChart(): Chart {
  const element = document.getElementById('pieChart');
  return new Chart(element, {
    type: ChartType.PIE,
    data: {
      labels: [`# Male:${this.male.length}, Percent:${(this.male.length / (this.male.length+this.female.length)) * 100}%`,
               `# Female:${this.female.length}, Percent:${(this.female.length / (this.male.length+this.female.length)) * 100}%`],
      datasets: [{data: [this.male.length, this.female.length],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 3
        }]
    },
    options: {
      title: { display: true, text: "pie chart" },
      legend: { display: true },
      display: true
    }
});
}








  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = 1;
  }


  public exportTableToExcel(): void {
    const downloadLink = document.createElement('a');
    const dataType = 'application/vnd.ms-excel';
    const table = document.getElementById('httptrace-table');
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    const filename = 'httptrace.xls';
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
}


 

  onAddEmployee(addForm:NgForm): void{
    document.getElementById('add-employee-form').click();
    this.service.addEmployee(addForm.value).subscribe(
      (response:Employee) =>{
        this.getEmployees();
        addForm.reset();
      },
      (error:HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }



  onUpdateEmployee(employee:Employee): void{
    this.service.addEmployee(employee).subscribe(
      (response:Employee) =>{
        this.getEmployees();
      },
      (error:HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }
  
  
  
  onDeleteEmployee(employeeId:number): void{
    this.service.deleteEmployee(employeeId).subscribe(
      (response:void) =>{
        this.getEmployees();
      },
      (error:HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }


  public searchEmployee(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 
          || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 
          || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }




  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    if (mode === 'view') {
      this.viewEmployee = employee;
      button.setAttribute('data-target', '#viewEmployeeModal');
    }

    container.appendChild(button);
    button.click();
  }









}
