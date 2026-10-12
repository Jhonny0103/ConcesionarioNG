import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Vehicles';

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/GetVehicles`);
  }

  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/GetVehicleById/${vehicleId}`);
  }

  createVehicle(vehicle: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/CreateVehicle`, vehicle);
  }

  updateVehicle(vehicle: UpdateVehicleDto): Observable<Vehicle> {
    console.log('Updating vehicle:', vehicle); // Log the vehicle object to the console
    return this.http.put<Vehicle>(`${this.apiUrl}/UpdateVehicle`, vehicle);
  }

  deleteVehicle(vehicleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteVehicle/${vehicleId}`);
  }
}
