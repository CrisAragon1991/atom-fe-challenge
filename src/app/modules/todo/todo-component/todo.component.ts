import { Component, inject, OnInit, signal } from '@angular/core';
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
  selectedTodo = signal<Todo|null>(null);

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
    this.todos.set(
      this.todos().map(t => t.id === edited.id ? { ...t, ...edited } : t)
    );
    this.closeEditModal();
  }
}