import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Models & Services
import { SaleService } from '../../../services/sale.service';
import { Sale, CreateSaleDto, UpdateSaleDto } from '../../../models/sale.model';

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
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  private readonly saleService = inject(SaleService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public sales: Sale[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public saleDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario y Detalles
  public selectedSale: Partial<Sale> = {};
  public vehicleIdInput: number | null = null;
  public customerIdInput: number | null = null;
  public salePriceInput: number | null = null;

  public isEditMode: boolean = false;
  public saving: boolean = false;

  ngOnInit(): void {
    this.loadSales();
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

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedSale = {};
    this.vehicleIdInput = null;
    this.customerIdInput = null;
    this.salePriceInput = null;
    this.saleDialog = true;
  }

  // Abrir Modal Editar
  editSale(sale: Sale): void {
    this.isEditMode = true;
    this.selectedSale = { ...sale };
    this.vehicleIdInput = sale.vehicleId;
    this.customerIdInput = sale.customerId;
    this.salePriceInput = sale.salePrice;
    this.saleDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(sale: Sale): void {
    this.selectedSale = { ...sale };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveSale(): void {
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
          this.loadSales();
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
          this.loadSales();
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
            this.loadSales();
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