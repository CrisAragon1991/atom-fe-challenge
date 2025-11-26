import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Todo } from '../../../models/todo';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() todo!: Todo;
  @Output() updated = new EventEmitter<Todo>();
  @Output() closed = new EventEmitter<void>();

  editTodo: Todo = {} as Todo;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todo'] && this.todo) {
      this.editTodo = { ...this.todo };
    }
  }

  save() {
    this.updated.emit(this.editTodo);
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
