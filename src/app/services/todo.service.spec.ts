import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { APP_CONFIG } from '../app.config';
import { environment } from 'src/environments/environment';
import { Todo } from '../models/todo';
import { GeneralResponse } from '../../shared/general-response';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + 'todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodoService,
        { provide: APP_CONFIG, useValue: environment }
      ]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todos', () => {
    const mockTodos: Todo[] = [
      { id: '1', name: 'Test', createdAt: new Date(), updatedAt: new Date(), stateId: '1' }
    ];
    service.getTodos().subscribe(res => {
      expect(res.data).toEqual(mockTodos);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTodos });
  });

  it('should get a todo by id', () => {
    const mockTodo: Todo = { id: '1', name: 'Test', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
    service.getTodo('1').subscribe(res => {
      expect(res.data).toEqual(mockTodo);
    });
    const req = httpMock.expectOne(apiUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockTodo });
  });

  it('should create a todo', () => {
    const newTodo: Partial<Todo> = { name: 'New Todo' };
    const mockResponse: GeneralResponse<Todo> = { success: true, data: { ...newTodo, id: '2', createdAt: new Date(), updatedAt: new Date(), stateId: '1' } as Todo };
    service.createTodo(newTodo).subscribe(res => {
      expect(res.data).toBeDefined();
      expect(res.data?.name).toBe('New Todo');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a todo', () => {
    const update: Partial<Todo> = { name: 'Updated' };
    const mockResponse: GeneralResponse<Todo> = { success: true, data: { id: '1', name: 'Updated', createdAt: new Date(), updatedAt: new Date(), stateId: '1' } };
    service.updateTodo('1', update).subscribe(res => {
      expect(res.data).toBeDefined();
      expect(res.data?.name).toBe('Updated');
    });
    const req = httpMock.expectOne(apiUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a todo', () => {
    service.deleteTodo('1').subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(apiUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, data: null });
  });
});
