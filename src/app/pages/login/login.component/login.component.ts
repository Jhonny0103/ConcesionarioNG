import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthLogin } from '../../../models/authlogin.model';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public name: string = '';
  public email: string = '';
  public errorMessage: string = '';
  public loading: boolean = false;

  onLogin(): void {
    if (!this.name.trim() || !this.email.trim()) {
      this.errorMessage = 'Por favor, ingresa el nombre y el correo electrónico.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginData: AuthLogin = {
      name: this.name.trim(),
      email: this.email.trim()
    };

    this.authService.getLogin(loginData).subscribe({
      next: (employe) => {
        this.loading = false;
        if (employe) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'Usuario o email no válidos.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
        console.error('Error de autenticación:', err);
      }
    });
  }
}
