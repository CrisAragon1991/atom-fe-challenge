import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../edit-component/edit.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, EditComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  todos = signal<Todo[]>([]);
  showEditModal = signal(false);
  selectedTodo = signal<Todo | null>(null);

  showAccountDropdown = signal(false);

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (res) => {
        if (res.data)
          this.todos.set(res.data);
      },
      error: (err) => {
        console.error('Error al cargar los todos', err);
      }
    });
  }

  toggleAccountDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showAccountDropdown.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event?: MouseEvent) {
    const target = (event?.target as HTMLElement) ?? document.body;
    const trigger = document.getElementById('accountMenu');
    const menu = document.getElementById('accountDropdownMenu');
    if (!trigger || !menu) {
      this.showAccountDropdown.set(false);
      return;
    }
    const clickedInsideTrigger = trigger.contains(target);
    const clickedInsideMenu = menu.contains(target);
    if (!clickedInsideTrigger && !clickedInsideMenu) {
      this.showAccountDropdown.set(false);
    }
  }

  openEditModal(todo: Todo) {
    this.selectedTodo.set(todo);
    this.showEditModal.set(true);
  }

  openNewTodoModal() {
    this.selectedTodo.set({
      id: '',
      name: '',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      stateId: '1',
    });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTodo.set(null);
  }

  updateTodo(edited: Todo) {
    if (!edited.id) {
      this.todoService.createTodo(edited).subscribe({
        next: (res) => {
          if (res.data) {
            this.todos.set([res.data, ...this.todos()]);
            Swal.fire({
              icon: 'success',
              title: '¡Tarea creada!',
              text: 'El todo fue creado correctamente.',
              timer: 1500,
              showConfirmButton: false
            });
          }
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error al crear el todo', err);
        }
      });
    } else {
      this.todoService.updateTodo(edited.id, edited).subscribe({
        next: (res) => {
          if (res.data) {
            this.todos.set(
              this.todos().map(t => t.id === edited.id ? { ...t, ...res.data } : t)
            );
            Swal.fire({
              icon: 'success',
              title: '¡Tarea actualizada!',
              text: 'El todo fue actualizado correctamente.',
              timer: 1500,
              showConfirmButton: false
            });
          }
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error al actualizar el todo', err);
        }
      });
    }
  }

  async onCheckboxComplete(todo: Todo, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    // Mostrar confirmación
    const result = await Swal.fire({
      title: '¿Finalizar tarea?',
      text: '¿Estás seguro de marcar esta tarea como completada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      // Actualizar el estado y llamar a updateTodo
      const updated = { ...todo, stateId: '2' };
      this.updateTodo(updated);
    } else {
      // Si cancela, desmarcar el checkbox
      checkbox.checked = false;
    }
  }

   async deleteTodo(todo: Todo) {
    const result = await Swal.fire({
      title: '¿Eliminar tarea?',
      text: 'Esta acción no se puede deshacer. ¿Deseas eliminar la tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      this.todoService.deleteTodo(todo.id).subscribe({
        next: () => {
          this.todos.set(this.todos().filter(t => t.id !== todo.id));
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'La tarea fue eliminada correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la tarea.'
          });
          console.error('Error al eliminar el todo', err);
        }
      });
    }
  }
}