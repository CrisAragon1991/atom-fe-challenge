import { Component, inject } from '@angular/core';
import { APP_CONFIG } from '../../app.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  config = inject(APP_CONFIG);
  // Ahora puedes acceder a config.apiUrl, config.production, etc.
}
