import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface MenuOption {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly router = inject(Router);

  public readonly options: MenuOption[] = [
    {
      title: 'Marcas',
      description: 'Gestión de fabricantes y marcas de vehículos',
      icon: 'pi pi-tags',
      route: '/brands',
      color: '#3b82f6'
    },
    {
      title: 'Modelos',
      description: 'Catálogo de modelos clasificados por marca',
      icon: 'pi pi-list',
      route: '/models',
      color: '#8b5cf6'
    },
    {
      title: 'Vehículos',
      description: 'Inventario de coches disponibles y estado',
      icon: 'pi pi-car',
      route: '/vehicles',
      color: '#10b981'
    },
    {
      title: 'Clientes',
      description: 'Base de datos de compradores y contactos',
      icon: 'pi pi-users',
      route: '/customers',
      color: '#f59e0b'
    },
    {
      title: 'Ventas',
      description: 'Registro de transacciones e historial de ventas',
      icon: 'pi pi-shopping-cart',
      route: '/sales',
      color: '#ef4444'
    }
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}