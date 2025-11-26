import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app.config';
import { Todo } from '../models/todo';
import { GeneralResponse } from '../../shared/general-response';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${this.config.apiUrl}todos`;

  getTodos(): Observable<GeneralResponse<Todo[]>> {
    return this.http.get<GeneralResponse<Todo[]>>(this.baseUrl);
  }

  getTodo(id: string): Observable<GeneralResponse<Todo>> {
    return this.http.get<GeneralResponse<Todo>>(`${this.baseUrl}/${id}`);
  }

  createTodo(todo: Partial<Todo>): Observable<GeneralResponse<Todo>> {
    return this.http.post<GeneralResponse<Todo>>(this.baseUrl, todo);
  }

  updateTodo(id: string, todo: Partial<Todo>): Observable<GeneralResponse<Todo>> {
    return this.http.put<GeneralResponse<Todo>>(`${this.baseUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<GeneralResponse<null>> {
    return this.http.delete<GeneralResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
