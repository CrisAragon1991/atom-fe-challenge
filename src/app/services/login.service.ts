import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../app.config';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../shared/general-response';
import { IUser } from '../models/user';
import { ILoginType } from '../models/login-type';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);

  login(email: string): Observable<GeneralResponse<ILoginType>> {
    return this.http.post<GeneralResponse<ILoginType>>(`${this.config.apiUrl}users/search`, { email });
  }

  createUser(email: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.config.apiUrl}users`, { email });
  }
}
