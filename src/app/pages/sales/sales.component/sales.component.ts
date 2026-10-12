import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';

// Models & Services
import { SaleService } from '../../../services/sale.service';
import { Sale, CreateSaleDto, UpdateSaleDto, SaleDetails } from '../../../models/sale.model';
import { Model } from '../../../models/model.model';
import { Brand } from '../../../models/brand.model';
import { BrandService } from '../../../services/brand.service';
import { ModelService } from '../../../services/model.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    SelectButtonModule,
    SelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  private readonly saleService = inject(SaleService);
  private readonly brandService = inject(BrandService);
  private readonly modelService = inject(ModelService);
  private readonly customerService = inject(CustomerService);
  private readonly vehicleService = inject(VehicleService); // Asegúrate de tener un servicio para vehículos
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public sales: Sale[] = [];
  public salesDetails: SaleDetails[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public saleDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario y Detalles
  public selectedSale: SaleDetails = {} as SaleDetails;
  public vehicleIdInput: number | null = null;
  public brandIdInput: number | null = null;
  public modelIdInput: number | null = null;
  public customerIdInput: number | null = null;
  public salePriceInput: number | null = null;

  // Datos adicionales
  public brands : Brand[] = [];
  public models : Model[] = [];
  public vehicles : Vehicle[] = []; // Cambiado a any[] temporalmente, deberías definir un modelo para Vehicle
  public vehiclesFiltered : Vehicle[] = []; // Cambiado a any[] temporalmente, deberías definir un modelo para Vehicle
  public vehiclesAux : Vehicle[] = []; // Cambiado a any[] temporalmente, deberías definir un modelo para Vehicle
  public customers : Customer[] = []; // Cambiado a any[] temporalmente, deberías definir un modelo para Customer

  public isEditMode: boolean = false;
  public saving: boolean = false;

  ngOnInit(): void {
    this.loadSalesDetails();
    this.loadBrands();
    this.loadModels();
    this.loadCustomers();
    this.loadVehicles();
  }

  // Cargar lista de ventas
  loadSales(): void {
    this.loading = true;
    this.saleService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las ventas'
        });
        this.loading = false;
      }
    });
  }

  loadBrands(): void {
    // Aquí puedes implementar la lógica para cargar las marcas desde un servicio
    this.loading = true;
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.loading = false;
        //console.log('Brands loaded:', this.brands);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las marcas'
        });
        this.loading = false;
      }
    });
  }

  loadModels(): void {
    // Aquí puedes implementar la lógica para cargar los modelos desde un servicio
    this.loading = true;
    this.modelService.getModels().subscribe({
      next: (data) => {
        this.models = data;
        this.loading = false;
        //console.log('Models loaded:', this.models);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los modelos'
        });
        this.loading = false;
      }
    });
  }

  loadSalesDetails(): void {
    this.loading = true;
    this.saleService.getSalesDetails().subscribe({
      next: (data) => {
        this.salesDetails = data;
        this.loading = false;
        //console.log('Sales details loaded:', this.salesDetails);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los detalles de las ventas'
        });
        this.loading = false;
      }
    });
  }

  loadCustomers(): void {
    // Aquí puedes implementar la lógica para cargar los clientes desde un servicio
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.customers.forEach(customer => {
          customer.fullName = `${customer.firstName} ${customer.lastName}`;
        });
        this.loading = false;
        //console.log('Customers loaded:', this.customers);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });
        this.loading = false;
      }
    });
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.vehicles.forEach(vehicle => {
          const brand = this.brands.find(b => b.brandId === vehicle.brandId);
          const model = this.models.find(m => m.modelId === vehicle.modelId);
          vehicle.fullName = `${brand?.brandName || 'Desconocido'} ${model?.modelName || 'Desconocido'} - ${vehicle.licensePlate}`;
        });
        this.vehiclesAux = [...this.vehicles];
        this.loading = false;
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

  filterVehiclesSold(): void {
    this.vehiclesFiltered = [];
    this.vehicles.forEach(vehicle => {
      if (!vehicle.isSold) {
        this.vehiclesFiltered.push(vehicle);
        this.vehicles = this.vehiclesFiltered;
      }
    });
  }

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedSale = {} as SaleDetails;
    this.vehicleIdInput = null;
    this.brandIdInput = null;
    this.modelIdInput = null;
    this.customerIdInput = null;
    this.salePriceInput = null;
    this.saleDialog = true;
    this.filterVehiclesSold();
  }

  // Abrir Modal Editar
  editSale(sale: SaleDetails): void {
    this.vehicles = this.vehiclesAux;
    this.vehicleIdInput = sale.vehicleId;
    this.isEditMode = true;
    this.selectedSale = { ...sale };
    this.customerIdInput = sale.customerId;
    this.salePriceInput = sale.salePrice;
    this.brandIdInput = sale.brandId;
    this.modelIdInput = sale.modelId;
    this.saleDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(sale: SaleDetails): void {
    console.log('Selected sale for details:', sale);
    this.selectedSale = { ...sale };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveSale(): void {
    console.log('Saving sale with inputs:', {
      vehicleId: this.vehicleIdInput,
      customerId: this.customerIdInput,
      salePrice: this.salePriceInput
    });
    if (!this.vehicleIdInput || !this.customerIdInput || this.salePriceInput === null || this.salePriceInput < 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, completa todos los campos con valores válidos.'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedSale.saleId) {
      // Editar
      const dto: UpdateSaleDto = {
        saleId: this.selectedSale.saleId,
        vehicleId: this.vehicleIdInput,
        customerId: this.customerIdInput,
        salePrice: this.salePriceInput
      };

      this.saleService.updateSale(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Venta actualizada correctamente'
          });
          this.saleDialog = false;
          this.saving = false;
          this.loadSalesDetails();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la venta'
          });
          this.saving = false;
        }
      });
    } else {
      // Crear
      const dto: CreateSaleDto = {
        vehicleId: this.vehicleIdInput,
        customerId: this.customerIdInput,
        salePrice: this.salePriceInput
      };

      this.saleService.createSale(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Venta registrada correctamente'
          });
          this.saleDialog = false;
          this.saving = false;
          this.loadSalesDetails();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar la venta'
          });
          this.saving = false;
        }
      });
    }
  }

  // Confirmar y Eliminar
  confirmDelete(sale: Sale): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la venta #${sale.saleId}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.saleService.deleteSale(sale.saleId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Venta eliminada con éxito'
            });
            this.loadSalesDetails();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la venta'
            });
          }
        });
      }
    });
  }
}