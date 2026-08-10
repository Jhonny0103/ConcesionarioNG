import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Model, CreateModelDto, UpdateModelDto } from '../models/model.model';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Models';

  getModels(): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.apiUrl}/GetModels`);
  }

  getModelById(modelId: number): Observable<Model> {
    return this.http.get<Model>(`${this.apiUrl}/GetModelById/${modelId}`);
  }

  createModel(model: CreateModelDto): Observable<Model> {
    return this.http.post<Model>(`${this.apiUrl}/CreateModel`, model);
  }

  updateModel(model: UpdateModelDto): Observable<Model> {
    return this.http.put<Model>(`${this.apiUrl}/UpdateModel`, model);
  }

  deleteModel(modelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteModel/${modelId}`);
  }
  
}
