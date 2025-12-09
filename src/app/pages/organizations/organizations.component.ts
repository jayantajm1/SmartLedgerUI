import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../api/api/organization.service';
import { AuthStateService } from '../../services/auth-state.service';
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

  private subscription?: Subscription;
  private orgId: string | null = null;

  constructor(
    private organizationService: OrganizationService,
    private authStateService: AuthStateService
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
    this.selectedOrganization = null;
    this.error = null;
  }
}
