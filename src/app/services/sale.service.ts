import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, CreateSaleDto, UpdateSaleDto, SaleDetails } from '../models/sale.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Sales';

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/GetSales`);
  }

  getSalesDetails(): Observable<SaleDetails[]> {
    return this.http.get<SaleDetails[]>(`${this.apiUrl}/GetSalesDetails/details`);
  }

  getSaleById(saleId: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/GetSaleById/${saleId}`);
  }

  createSale(sale: CreateSaleDto): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/CreateSale`, sale);
  }

  updateSale(sale: UpdateSaleDto): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/UpdateSale`, sale);
  }

  deleteSale(saleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteSale/${saleId}`);
  }
}
