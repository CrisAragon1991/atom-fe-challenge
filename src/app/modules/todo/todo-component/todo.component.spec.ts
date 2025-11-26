
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { APP_CONFIG } from 'src/app/app.config';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from '../../../services/todo.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Todo } from '../../../models/todo';
import { GeneralResponse } from 'src/shared/general-response';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTodos']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    // Mock por defecto para evitar error en ngOnInit
    let todosMock: GeneralResponse<Todo[]> = {
      success: true,
      data: []
    };
    todoServiceSpy.getTodos.and.returnValue(of(todosMock));

    await TestBed.configureTestingModule({
      imports: [TodoComponent, HttpClientModule],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    const todosMock: GeneralResponse<Todo[]> = {
      success: true,
      data: [
        { id: '1', name: 'Test Todo', createdAt: new Date(), updatedAt: new Date(), stateId: '1' }
      ]
    };
    todoServiceSpy.getTodos.and.returnValue(of(todosMock));
    component.ngOnInit();
    expect(component.todos().length).toBe(1);
    expect(component.todos()[0].name).toBe('Test Todo');
  });

  it('should open and close edit modal', () => {
    const todo: Todo = { id: '1', name: 'Edit', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
    component.openEditModal(todo);
    expect(component.showEditModal()).toBeTrue();
    expect(component.selectedTodo()).toEqual(todo);
    component.closeEditModal();
    expect(component.showEditModal()).toBeFalse();
    expect(component.selectedTodo()).toBeNull();
  });

  it('should toggle account dropdown', () => {
    const event = { preventDefault: () => {}, stopPropagation: () => {} } as any;
    expect(component.showAccountDropdown()).toBeFalse();
    component.toggleAccountDropdown(event);
    expect(component.showAccountDropdown()).toBeTrue();
    component.toggleAccountDropdown(event);
    expect(component.showAccountDropdown()).toBeFalse();
  });

  it('should logout and navigate to login', () => {
    spyOn(localStorage, 'removeItem');
    component.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('login');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
