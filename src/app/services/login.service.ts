import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../app.config';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../shared/general-response';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);

  login(email: string): Observable<GeneralResponse<IUser>> {
    return this.http.post<GeneralResponse<IUser>>(`${this.config.apiUrl}users/search`, { email });
  }

  createUser(email: string): Observable<any> {
    return this.http.post(`${this.config.apiUrl}users`, { email });
  }
}
