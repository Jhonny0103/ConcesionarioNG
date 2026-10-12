import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';

// Models & Services
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../../../models/vehicle.model';
import { Brand } from '../../../models/brand.model';
import { Model } from '../../../models/model.model';
import { ModelService } from '../../../services/model.service';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly modelService = inject(ModelService);
  private readonly brandService = inject(BrandService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public vehicles: Vehicle[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public vehicleDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario y Detalles
  public selectedVehicle: Partial<Vehicle> = {};
  
  // Campos del Formulario
  public modelIdInput: number | null = null;
  public brandIdInput: number | null = null;
  public licensePlateInput: string = '';
  public colorInput: string = '';
  public yearInput: number | null = null;
  public mileageInput: number | null = null;
  public priceInput: number | null = null;

  public isEditMode: boolean = false;
  public saving: boolean = false;

  // Datos adicionales selects
  public brands: Brand [] = [];
  public models: Model [] = [];

  ngOnInit(): void {
    this.loadBrands();
    this.loadModels();
    this.loadVehicles();
  }

  loadBrands(){
    this.brandService.getBrands().subscribe({
      next:(data) => {
        this.brands = data;
        // console.log('Brands loaded:', this.brands);
      }
    })
  }

  loadModels(){
    this.modelService.getModels().subscribe({
      next:(data) => {
        this.models = data;
        // console.log('Models loaded:', this.models);
      }
    })
  }

  // Cargar lista de vehículos
  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
        // console.log('Vehicles loaded:', this.vehicles);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los vehículos'
        });
        this.loading = false;
      }
    });
  }

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedVehicle = {};
    this.modelIdInput = null;
    this.brandIdInput = null;
    this.licensePlateInput = '';
    this.colorInput = '';
    this.yearInput = new Date().getFullYear();
    this.mileageInput = 0;
    this.priceInput = null;
    this.vehicleDialog = true;
  }

  // Abrir Modal Editar
  editVehicle(vehicle: Vehicle): void {
    this.isEditMode = true;
    this.selectedVehicle = { ...vehicle };
    this.modelIdInput = vehicle.modelId;
    this.brandIdInput = vehicle.brandId; // Asignar si tu backend retorna el brandId en la consulta
    this.licensePlateInput = vehicle.licensePlate;
    this.colorInput = vehicle.color;
    this.yearInput = vehicle.year;
    this.mileageInput = vehicle.mileage;
    this.priceInput = vehicle.price;
    this.vehicleDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveVehicle(): void {
    if (
      !this.modelIdInput || 
      !this.brandIdInput || 
      !this.licensePlateInput.trim() || 
      !this.colorInput.trim() || 
      !this.yearInput || 
      this.mileageInput === null || 
      !this.priceInput
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, completa todos los campos requeridos.'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedVehicle.vehicleId) {
      // Editar
      const dto: UpdateVehicleDto = {
        vehicleId: this.selectedVehicle.vehicleId,
        modelId: this.modelIdInput,
        brandId: this.brandIdInput,
        licensePlate: this.licensePlateInput.trim().toUpperCase(),
        color: this.colorInput.trim(),
        year: this.yearInput,
        mileage: this.mileageInput,
        price: this.priceInput
      };

      this.vehicleService.updateVehicle(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Vehículo actualizado correctamente'
          });
          this.vehicleDialog = false;
          this.saving = false;
          this.loadVehicles();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el vehículo'
          });
          this.saving = false;
        }
      });
    } else {
      // Crear
      const dto: CreateVehicleDto = {
        modelId: this.modelIdInput,
        brandId: this.brandIdInput,
        licensePlate: this.licensePlateInput.trim().toUpperCase(),
        color: this.colorInput.trim(),
        year: this.yearInput,
        mileage: this.mileageInput,
        price: this.priceInput
      };

      this.vehicleService.createVehicle(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Vehículo registrado correctamente'
          });
          this.vehicleDialog = false;
          this.saving = false;
          this.loadVehicles();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar el vehículo'
          });
          this.saving = false;
        }
      });
    }
  }

  // Confirmar y Eliminar
  confirmDelete(vehicle: Vehicle): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el vehículo con matrícula "${vehicle.licensePlate}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Vehículo eliminado con éxito'
            });
            this.loadVehicles();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el vehículo'
            });
          }
        });
      }
    });
  }
}