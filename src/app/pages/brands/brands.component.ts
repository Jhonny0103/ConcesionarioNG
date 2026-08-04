import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html'
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  
  public brands: Brand[] = [];
  public errorMessage: string = '';

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
        console.log('Marcas cargadas con éxito:', data);
      },
      error: (err) => {
        this.errorMessage = 'Error al conectar con el servidor';
        console.error('Error HTTP:', err);
      }
    });
  }
}