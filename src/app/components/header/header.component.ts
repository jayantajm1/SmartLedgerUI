import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showAction: boolean = false;
  @Input() actionLabel: string = 'Add';

  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  currentUser$ = this.authStateService.currentUser;

  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }
}
