import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Models & Services
import { CustomerService } from '../../../services/customer.service';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToggleSwitchModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public customers: Customer[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public customerDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario y Detalles
  public selectedCustomer: Partial<Customer> = {};
  public firstNameInput: string = '';
  public lastNameInput: string = '';
  public emailInput: string = '';
  public phoneNumberInput: string = '';
  public isActiveInput: boolean = true;

  public isEditMode: boolean = false;
  public saving: boolean = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Cargar lista de clientes
  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
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

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedCustomer = {};
    this.firstNameInput = '';
    this.lastNameInput = '';
    this.emailInput = '';
    this.phoneNumberInput = '';
    this.isActiveInput = true;
    this.customerDialog = true;
  }

  // Abrir Modal Editar
  editCustomer(customer: Customer): void {
    this.isEditMode = true;
    this.selectedCustomer = { ...customer };
    this.firstNameInput = customer.firstName;
    this.lastNameInput = customer.lastName;
    this.emailInput = customer.email;
    this.phoneNumberInput = customer.phoneNumber || '';
    this.isActiveInput = customer.isActive;
    this.customerDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(customer: Customer): void {
    this.selectedCustomer = { ...customer };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveCustomer(): void {
    if (!this.firstNameInput.trim() || !this.lastNameInput.trim() || !this.emailInput.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Nombre, apellidos y correo son campos obligatorios.'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedCustomer.customerId) {
      // Editar
      const dto: UpdateCustomerDto = {
        customerId: this.selectedCustomer.customerId,
        firstName: this.firstNameInput.trim(),
        lastName: this.lastNameInput.trim(),
        email: this.emailInput.trim(),
        phoneNumber: this.phoneNumberInput.trim() || undefined,
        isActive: this.isActiveInput
      };

      this.customerService.updateCustomer(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente actualizado correctamente'
          });
          this.customerDialog = false;
          this.saving = false;
          this.loadCustomers();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el cliente'
          });
          this.saving = false;
        }
      });
    } else {
      // Crear
      const dto: CreateCustomerDto = {
        firstName: this.firstNameInput.trim(),
        lastName: this.lastNameInput.trim(),
        email: this.emailInput.trim(),
        phoneNumber: this.phoneNumberInput.trim() || undefined
      };

      this.customerService.createCustomer(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente registrado correctamente'
          });
          this.customerDialog = false;
          this.saving = false;
          this.loadCustomers();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar el cliente'
          });
          this.saving = false;
        }
      });
    }
  }

  // Confirmar y Eliminar
  confirmDelete(customer: Customer): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar al cliente "${customer.firstName} ${customer.lastName}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.deleteCustomer(customer.customerId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Cliente eliminado con éxito'
            });
            this.loadCustomers();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente'
            });
          }
        });
      }
    });
  }
}