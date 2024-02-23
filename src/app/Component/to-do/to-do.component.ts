import { Component, ElementRef, ViewChild } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.scss',
})
export class ToDoComponent {
  title = 'To Do List';

  imageSrc: string = 'https://cdn-icons-png.flaticon.com/512/4697/4697260.png';

  tasks: Task[] = this.getStoredTasks();

  updateTask: Task | null = null;

  errorMsg: string = '';
  successMsg: string = '';

  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;

  cancel() {
    this.taskInput.nativeElement.value = '';
    this.successMsg = 'Item update canceled';
  }

  addTask(event: any, taskInput: HTMLInputElement): void {
    event.preventDefault();

    const taskName = taskInput.value.trim();
    if (taskName !== '') {
      this.tasks.push({
        id: new Date().getTime(),
        name: taskName,
        completed: false,
      });
      this.updateStorage();

      this.showToast('Item added successfully', 'success');

      taskInput.value = '';
    } else {
      this.showToast('Please enter a task', 'error');
    }
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.updateStorage();

    this.showToast('Item deleted successfully', 'success');
  }

  editTask(index: number): void {
    Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputLabel: 'Enter the new task',
      inputValue: this.tasks[index].name,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.tasks[index].name = result.value;
        this.updateStorage();
        this.showToast('Item updated successfully', 'success');
      } else {
        this.showToast('No item to update', 'info');
      }
    });
  }

  toggleCompleted(selectedTask: Task): void {
    selectedTask.completed = !selectedTask.completed;
    this.updateStorage();
    selectedTask.completed
      ? this.showToast('Item done successfully', 'success')
      : this.showToast('Item not done yet', 'success');
  }

  private updateStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private getStoredTasks(): Task[] {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  showToast(text: string, icon: any) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      text: text,
      icon: icon,
    });
  }
}

interface Task {
  id: number;
  name: string;
  completed: boolean;
}
