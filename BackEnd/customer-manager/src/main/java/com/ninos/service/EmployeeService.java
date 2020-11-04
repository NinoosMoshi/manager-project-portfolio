package com.ninos.service;

import com.ninos.model.Employee;

import java.util.List;

public interface EmployeeService {

    public Employee addEmployee(Employee employee);

    public List<Employee> findAllEmployee();

    public Employee updateEmployee(Employee employee);

    public Employee findEmployeeById(Long id);

    public void deleteEmployee(Long id);


}
