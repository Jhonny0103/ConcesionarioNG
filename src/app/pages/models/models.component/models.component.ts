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
import { ModelService } from '../../../services/model.service';
import { Model, CreateModelDto, UpdateModelDto } from '../../../models/model.model';

@Component({
  selector: 'app-models',
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
  templateUrl: './models.component.html',
  styleUrl: './models.component.css'
})
export class ModelsComponent implements OnInit {
  private readonly modelService = inject(ModelService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Estado de la tabla
  public models: Model[] = [];
  public loading: boolean = true;

  // Estado de los Modales
  public modelDialog: boolean = false;
  public detailsDialog: boolean = false;

  // Objeto de trabajo para Formulario y Detalles
  public selectedModel: Partial<Model> = {};
  public modelNameInput: string = '';
  public isEditMode: boolean = false;
  public saving: boolean = false;

  ngOnInit(): void {
    this.loadModels();
  }

  // Cargar lista de modelos
  loadModels(): void {
    this.loading = true;
    this.modelService.getModels().subscribe({
      next: (data) => {
        this.models = data;
        this.loading = false;
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

  // Abrir Modal Crear
  openNew(): void {
    this.isEditMode = false;
    this.selectedModel = {};
    this.modelNameInput = '';
    this.modelDialog = true;
  }

  // Abrir Modal Editar
  editModel(model: Model): void {
    this.isEditMode = true;
    this.selectedModel = { ...model };
    this.modelNameInput = model.modelName;
    this.modelDialog = true;
  }

  // Abrir Modal Detalles
  showDetails(model: Model): void {
    this.selectedModel = { ...model };
    this.detailsDialog = true;
  }

  // Guardar (Crear o Actualizar)
  saveModel(): void {
    if (!this.modelNameInput.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'El nombre del modelo es obligatorio'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedModel.modelId) {
      // Editar
      const dto: UpdateModelDto = {
        modelId: this.selectedModel.modelId,
        modelName: this.modelNameInput.trim()
      };

      this.modelService.updateModel(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Modelo actualizado correctamente'
          });
          this.modelDialog = false;
          this.saving = false;
          this.loadModels();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el modelo'
          });
          this.saving = false;
        }
      });
    } else {
      // Crear
      const dto: CreateModelDto = {
        modelName: this.modelNameInput.trim()
      };

      this.modelService.createModel(dto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Modelo creado correctamente'
          });
          this.modelDialog = false;
          this.saving = false;
          this.loadModels();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el modelo'
          });
          this.saving = false;
        }
      });
    }
  }

  // Confirmar y Eliminar
  confirmDelete(model: Model): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el modelo "${model.modelName}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.modelService.deleteModel(model.modelId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Modelo eliminado con éxito'
            });
            this.loadModels();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el modelo'
            });
          }
        });
      }
    });
  }
}