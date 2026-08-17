import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component/main-layout.component';
import { authGuard } from './guards/auth.guard'; // Importamos el Guard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component/login.component').then(m => m.LoginComponent) 
  },

  // Aplicamos canActivate en el objeto padre
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // <-- Protege Dashboard, Brands, Models, etc.
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'brands', 
        loadComponent: () => import('./pages/brands/brands.component').then(m => m.BrandsComponent) 
      },
      { 
        path: 'models', 
        loadComponent: () => import('./pages/models/models.component/models.component').then(m => m.ModelsComponent) 
      },
      { 
        path: 'vehicles', 
        loadComponent: () => import('./pages/vehicles/vehicles.component/vehicles.component').then(m => m.VehiclesComponent) 
      },
      { 
        path: 'customers', 
        loadComponent: () => import('./pages/customers/customers.component/customers.component').then(m => m.CustomersComponent) 
      },
      { 
        path: 'sales', 
        loadComponent: () => import('./pages/sales/sales.component/sales.component').then(m => m.SalesComponent) 
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];