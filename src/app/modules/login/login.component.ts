import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  email = '';
  loading = false;
  error: string | null = null;

  onSubmit() {
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Por favor ingresa un correo electrónico válido.';
      return;
    }
    this.loading = true;
    this.error = null;
    this.loginService.login(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('login', JSON.stringify(res.data));
        this.router.navigate(['/todo']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.createUser(this.email);
        } else {
          this.loading = false;
          this.error = 'Error al iniciar sesión';
        }
      }
    });
  }

  async createUser(email: string) {
    const result = await Swal.fire({
      title: '¿Crear nuevo usuario?',
      text: `¿Deseas crear el usuario con el correo ${email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      this.loginService.createUser(email).subscribe({
        next: (res) => {
          this.loading = false;
          this.onSubmit();
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al crear el usuario';
        }
      });
    } else {
      this.loading = false;
    }
  }
}
