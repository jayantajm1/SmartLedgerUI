import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { UsersService } from '../../api/api/users.service';
import { User } from '../../api/model/user';
import { UpdateUserRoleDto } from '../../api/model/updateUserRoleDto';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showRoleModal: boolean = false;

  currentUser: User = this.getEmptyUser();
  selectedUserId: string = '';
  selectedRole: string = '';

  constructor(
    private usersService: UsersService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get current user's organization ID
    const currentUser = this.authStateService.currentUserValue;
    const orgId = currentUser?.orgId;

    if (!orgId) {
      this.errorMessage = 'Organization ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.usersService.apiV1UsersOrganizationOrgIdGet(orgId).subscribe({
      next: (response) => {
        this.users = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      },
    });
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  openRoleModal(user: User): void {
    this.selectedUserId = user.id || '';
    this.selectedRole = user.role || 'Viewer';
    this.showRoleModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentUser = this.getEmptyUser();
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.selectedUserId = '';
    this.selectedRole = '';
  }

  updateUserRole(): void {
    if (!this.selectedUserId || !this.selectedRole) {
      this.errorMessage = 'Invalid user or role selection';
      return;
    }

    this.isLoading = true;
    const updateDto: UpdateUserRoleDto = {
      role: this.selectedRole,
    };

    this.usersService
      .apiV1UsersIdRolePut(this.selectedUserId, updateDto)
      .subscribe({
        next: () => {
          this.successMessage = 'User role updated successfully!';
          this.closeRoleModal();
          this.loadUsers(); // Reload the list
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          this.errorMessage =
            error.error?.message || 'Failed to update user role';
          this.isLoading = false;
        },
      });
  }

  viewUserDetails(userId: string): void {
    this.usersService.apiV1UsersIdGet(userId).subscribe({
      next: (user) => {
        console.log('User details:', user);
        this.currentUser = user;
        this.isEditing = true;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.errorMessage = 'Failed to load user details';
      },
    });
  }

  deleteUser(id: string): void {
    if (!id) return;

    if (
      confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      this.isLoading = true;

      this.usersService.apiV1UsersIdDelete(id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully!';
          this.loadUsers(); // Reload the list
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = error.error?.message || 'Failed to delete user';
          this.isLoading = false;
        },
      });
    }
  }

  private getEmptyUser(): User {
    return {
      id: '',
      name: '',
      email: '',
      role: 'Viewer',
    };
  }
}
