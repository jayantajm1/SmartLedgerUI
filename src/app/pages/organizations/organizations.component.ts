import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../api/api/organization.service';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../api/services/AuthService';
import { AuthClient, RegisterRequest } from '../../api/nswag-client';
import { Organization } from '../../api/model/organization';
import { OrganizationCreateDto } from '../../api/model/organizationCreateDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit, OnDestroy {
  organizations: Organization[] = [];
  selectedOrganization: Organization | null = null;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Form states
  showCreateForm = false;
  showEditForm = false;
  showCreateUserForm = false;

  // Form data
  newOrganization: OrganizationCreateDto = {
    name: '',
    industry: '',
    gstNumber: '',
    country: '',
    plan: '',
  };

  editOrganization: OrganizationCreateDto = {
    name: '',
    industry: '',
    gstNumber: '',
    country: '',
    plan: '',
  };

  // User creation form data
  newUser: RegisterRequest = {
    name: '',
    email: '',
    password: '',
  };

  private subscription?: Subscription;
  private orgId: string | null = null;

  constructor(
    private organizationService: OrganizationService,
    private authStateService: AuthStateService,
    private authService: AuthService,
    private authClient: AuthClient
  ) {}

  ngOnInit(): void {
    this.subscription = this.authStateService.currentUser.subscribe(
      (user: any) => {
        if (user?.orgId) {
          this.orgId = user.orgId;
          this.loadOrganizations();
        } else {
          this.error = 'Organization ID not found. Please log in again.';
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadOrganizations(): void {
    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.organizationService.apiV1OrganizationsIdGet(this.orgId).subscribe({
      next: (data) => {
        this.organizations = [data]; // Wrap in array to maintain compatibility
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading organization:', err);
        this.error = 'Failed to load organization. Please try again.';
        this.isLoading = false;
      },
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.selectedOrganization = null;
    this.error = null;
    this.successMessage = null;
    this.newOrganization = {
      name: '',
      industry: '',
      gstNumber: '',
      country: '',
      plan: '',
    };
  }

  createOrganization(): void {
    if (!this.newOrganization.name) {
      this.error = 'Organization name is required.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.organizationService
      .apiV1OrganizationsPost(this.newOrganization)
      .subscribe({
        next: () => {
          this.successMessage = 'Organization created successfully!';
          this.showCreateForm = false;
          this.loadOrganizations();
          this.isLoading = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error creating organization:', err);
          const errorMessage =
            err?.error?.message ||
            err?.message ||
            'Failed to create organization. Please try again.';
          this.error = errorMessage;
          this.isLoading = false;
        },
      });
  }

  openEditForm(organization: Organization): void {
    this.selectedOrganization = organization;
    this.showEditForm = true;
    this.showCreateForm = false;
    this.error = null;
    this.successMessage = null;

    this.editOrganization = {
      name: organization.name || '',
      industry: organization.industry || '',
      gstNumber: organization.gstNumber || '',
      country: organization.country || '',
      plan: organization.plan || '',
    };
  }

  updateOrganization(): void {
    if (!this.selectedOrganization?.id) {
      this.error = 'No organization selected.';
      return;
    }

    if (!this.editOrganization.name) {
      this.error = 'Organization name is required.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.organizationService
      .apiV1OrganizationsIdPut(
        this.selectedOrganization.id,
        this.editOrganization
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Organization updated successfully!';
          this.showEditForm = false;
          this.selectedOrganization = null;
          this.loadOrganizations();
          this.isLoading = false;
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          console.error('Error updating organization:', err);
          this.error = 'Failed to update organization. Please try again.';
          this.isLoading = false;
        },
      });
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showCreateUserForm = false;
    this.selectedOrganization = null;
    this.error = null;
  }

  openCreateUserForm(): void {
    this.showCreateUserForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.error = null;
    this.successMessage = null;
    this.newUser = {
      name: '',
      email: '',
      password: '',
    };
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.error = 'Name, email, and password are required.';
      return;
    }

    if (!this.orgId) {
      this.error = 'Organization ID not found.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Get current user ID for the create-user API
    const currentUser = this.authStateService.currentUserValue;
    const userId = currentUser?.id;

    // Call the create-user endpoint using AuthService
    this.authService
      .postApiV1AuthCreateUser(userId, this.newUser)
      .subscribe({
        next: (response: any) => {
          // Check if the response indicates successful user creation
          if (response || response === null || response === undefined) {
            // The API returns success for status 200, so any response in the success callback is good
            this.successMessage = 'User created successfully for the organization!';
            this.showCreateUserForm = false;
            // Reset the form
            this.newUser = {
              name: '',
              email: '',
              password: '',
            };
            this.loadOrganizations(); // Refresh the organizations list
            this.isLoading = false;
            setTimeout(() => (this.successMessage = null), 3000);
          } else {
            // If response doesn't match expected success format
            this.error = 'User creation completed but response format unexpected.';
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          console.error('Error creating user:', err);
          let errorMessage = 'Failed to create user. Please try again.';

          // Check for specific error status codes
          if (err?.status) {
            switch (err.status) {
              case 400:
                errorMessage = 'Invalid user data. Please check the form fields.';
                break;
              case 401:
                errorMessage = 'Unauthorized. Please log in again.';
                break;
              case 403:
                errorMessage = 'You do not have permission to create users for this organization.';
                break;
              case 409:
                errorMessage = 'A user with this email already exists.';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              default:
                errorMessage = `Error ${err.status}: ${err.statusText || 'Unknown error'}`;
            }
          } else if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.message) {
            errorMessage = err.message;
          }

          this.error = errorMessage;
          this.isLoading = false;
        },
      });
  }
}
