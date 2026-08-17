import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Models & Services
import { BrandService } from '../../services/brand.service';
import { Brand, CreateBrandDto, UpdateBrandDto } from '../../models/brand.model';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public brands: Brand[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public brandDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario (Crear/Editar) y Detalles
  public selectedBrand: Partial<Brand> = {};
  public brandNameInput: string = '';
  public isEditMode: boolean = false;
  public saving: boolean = false;

  ngOnInit(): void {
    this.loadBrands();
  }

  // Cargar lista de marcas
  loadBrands(): void {
    this.loading = true;
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las marcas'
        });
        this.loading = false;
      }
    });
  }

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedBrand = {};
    this.brandNameInput = '';
    this.brandDialog = true;
  }

  // Abrir Modal Editar
  editBrand(brand: Brand): void {
    this.isEditMode = true;
    this.selectedBrand = { ...brand };
    this.brandNameInput = brand.brandName;
    this.brandDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(brand: Brand): void {
    this.selectedBrand = { ...brand };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveBrand(): void {
    if (!this.brandNameInput.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El nombre de la marca es obligatorio'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedBrand.brandId) {
      // Editar
      const dto: UpdateBrandDto = {
        brandId: this.selectedBrand.brandId,
        brandName: this.brandNameInput.trim()
      };

      this.brandService.updateBrand(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Marca actualizada correctamente'
          });
          this.brandDialog = false;
          this.saving = false;
          this.loadBrands();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la marca'
          });
          this.saving = false;
        }
      });
    } else {
      // Crear
      const dto: CreateBrandDto = {
        brandName: this.brandNameInput.trim()
      };

      this.brandService.createBrand(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Marca creada correctamente'
          });
          this.brandDialog = false;
          this.saving = false;
          this.loadBrands();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la marca'
          });
          this.saving = false;
        }
      });
    }
  }

  // Confirmar y Eliminar
  confirmDelete(brand: Brand): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la marca "${brand.brandName}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.brandService.deleteBrand(brand.brandId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Marca eliminada con éxito'
            });
            this.loadBrands();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la marca, tiene vehiculos asociados'
            });
          }
        });
      }
    });
  }
}