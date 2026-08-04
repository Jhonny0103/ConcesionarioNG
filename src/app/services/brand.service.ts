import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Brand, CreateBrandDto, UpdateBrandDto} from '../models/brand.model';

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://localhost:7129/api/Brands';

    getBrands(): Observable<Brand[]> {
        return this.http.get<Brand[]>(this.apiUrl+'/GetBrands');
    }

    getBrandById(brandId: number): Observable<Brand> {
        return this.http.get<Brand>(`${this.apiUrl}/${brandId}`);
    }

    createBrand(brand: CreateBrandDto) : Observable<Brand>{
        return this.http.post<Brand>(this.apiUrl, brand);
    }

    updateBrand(brand: UpdateBrandDto): Observable<Brand> {
        return this.http.put<Brand>(`${this.apiUrl}/`, brand);
    }

    deleteBrand(brandId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${brandId}`);
    }
}