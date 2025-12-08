import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiConfigService } from '../../services/api-config.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-api-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-status" *ngIf="!environment.production">
      <div class="status-badge" [class.connected]="isConnected">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
      <button
        class="refresh-btn"
        (click)="refreshConnection()"
        [disabled]="isRefreshing"
      >
        {{ isRefreshing ? 'Checking...' : 'Refresh' }}
      </button>
    </div>
  `,
  styles: [
    `
      .api-status {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        font-size: 13px;
      }

      .status-badge {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f56565;
        animation: pulse 2s infinite;
      }

      .status-badge.connected .status-dot {
        background: #48bb78;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .status-text {
        font-weight: 600;
        color: #2d3748;
      }

      .refresh-btn {
        padding: 6px 12px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .refresh-btn:hover:not(:disabled) {
        background: #764ba2;
      }

      .refresh-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class ApiStatusComponent implements OnInit {
  environment = environment;
  isConnected = false;
  statusText = 'Detecting API...';
  isRefreshing = false;
  currentApiUrl = '';

  constructor(private apiConfigService: ApiConfigService) {}

  async ngOnInit() {
    await this.checkConnection();
  }

  async checkConnection() {
    try {
      this.currentApiUrl = await this.apiConfigService.detectApiUrl();
      this.isConnected = true;
      this.statusText = `Connected: ${this.currentApiUrl}`;
    } catch {
      this.isConnected = false;
      this.statusText = 'API Disconnected';
    }
  }

  async refreshConnection() {
    this.isRefreshing = true;
    this.apiConfigService.resetDetection();
    await this.checkConnection();
    this.isRefreshing = false;
  }
}
