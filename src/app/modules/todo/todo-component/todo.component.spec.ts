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

    it('should update an existing todo', async () => {
      const todo: Todo = { id: '1', name: 'Original', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
      component.todos.set([todo]);
      const updated: Todo = { ...todo, name: 'Updated' };
      const response = { success: true, data: updated };
      todoServiceSpy.updateTodo = jasmine.createSpy().and.returnValue(of(response));
      // Mock Swal.fire solo durante este test
      const SwalImport = await import('sweetalert2/dist/sweetalert2.all.js');
      const originalFire = SwalImport.default.fire;
      SwalImport.default.fire = () => Promise.resolve({}) as any;
      try {
        component.updateTodo(updated);
        expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith('1', updated);
        expect(component.todos()[0].name).toBe('Updated');
      } finally {
        SwalImport.default.fire = originalFire;
      }
    });

  it('should create a new todo', async () => {
    const newTodo: any = { name: 'Nuevo', description: '', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
    const created: Todo = { ...newTodo, id: '2' };
    const response = { success: true, data: created };
    todoServiceSpy.createTodo = jasmine.createSpy().and.returnValue(of(response));
    // Mock Swal.fire solo durante este test
    const SwalImport = await import('sweetalert2/dist/sweetalert2.all.js');
    const originalFire = SwalImport.default.fire;
    SwalImport.default.fire = () => Promise.resolve({}) as any;
    try {
      component.todos.set([]);
      component.updateTodo(newTodo);
      expect(todoServiceSpy.createTodo).toHaveBeenCalledWith(newTodo);
      expect(component.todos()[0].id).toBe('2');
      expect(component.todos()[0].name).toBe('Nuevo');
    } finally {
      SwalImport.default.fire = originalFire;
    }
  });

  it('should delete a todo after confirmation', async () => {
    const todo: Todo = { id: '1', name: 'Eliminar', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
    component.todos.set([todo]);
    todoServiceSpy.deleteTodo = jasmine.createSpy().and.returnValue(of({ success: true, data: null }));
    const SwalImport = await import('sweetalert2/dist/sweetalert2.all.js');
    const originalFire = SwalImport.default.fire;
    SwalImport.default.fire = () => Promise.resolve({ isConfirmed: true }) as any;
    try {
      await component.deleteTodo(todo);
      expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith('1');
      expect(component.todos().length).toBe(0);
    } finally {
      SwalImport.default.fire = originalFire;
    }
  });

  it('should mark a todo as completed after checkbox confirmation', async () => {
    const todo: Todo = { id: '1', name: 'Completar', createdAt: new Date(), updatedAt: new Date(), stateId: '1' };
    component.todos.set([todo]);
    const updated: Todo = { ...todo, stateId: '2' };
    todoServiceSpy.updateTodo = jasmine.createSpy().and.returnValue(of({ success: true, data: updated }));
    const SwalImport = await import('sweetalert2/dist/sweetalert2.all.js');
    const originalFire = SwalImport.default.fire;
    SwalImport.default.fire = () => Promise.resolve({ isConfirmed: true }) as any;
    try {
      const event = { target: document.createElement('input') } as any;
      await component.onCheckboxComplete(todo, event);
      expect(todoServiceSpy.updateTodo).toHaveBeenCalledWith('1', { ...todo, stateId: '2' });
      expect(component.todos()[0].stateId).toBe('2');
    } finally {
      SwalImport.default.fire = originalFire;
    }
  });

});
