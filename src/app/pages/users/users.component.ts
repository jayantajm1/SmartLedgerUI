import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;

  currentUser: User = this.getEmptyUser();
  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscription = this.dataService.users$.subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.currentUser = this.getEmptyUser();
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentUser = this.getEmptyUser();
  }

  saveUser(): void {
    if (!this.currentUser.name || !this.currentUser.email) {
      alert('Please fill all required fields');
      return;
    }

    if (this.isEditing) {
      this.dataService.updateUser(this.currentUser);
    } else {
      this.currentUser.id = this.dataService.generateId();
      this.currentUser.created_at = new Date().toISOString();
      this.dataService.addUser(this.currentUser);
    }

    this.closeModal();
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.dataService.deleteUser(id);
    }
  }

  private getEmptyUser(): User {
    return {
      id: '',
      name: '',
      email: '',
      role: 'Viewer',
      created_at: ''
    };
  }
}
