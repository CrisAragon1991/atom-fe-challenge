import { Component, inject } from '@angular/core';
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

  createUser(email: string) {
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
  }
}
