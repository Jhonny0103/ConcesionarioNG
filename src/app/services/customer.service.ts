import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Customers';

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/GetCustomers`);
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/GetCustomerById/${customerId}`);
  }

  createCustomer(customer: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/CreateCustomer`, customer);
  }

  updateCustomer(customer: UpdateCustomerDto): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/UpdateCustomer`, customer);
  } 

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteCustomer/${customerId}`);
  }

}
