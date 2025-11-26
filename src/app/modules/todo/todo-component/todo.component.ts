import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { Todo } from '../../../models/todo';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  todos = signal<Todo[]>([]);

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
}