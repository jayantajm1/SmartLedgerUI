// src/environments/environment.ts
export const environment = {
  production: false,
  // Backend API URLs - will try in order until one responds
  apiUrls: [
    'https://localhost:7257', // HTTPS - primary
    'http://localhost:5239', // HTTP - secondary
    'http://localhost:26624', // IIS Express
    'http://localhost:8080', // Docker HTTP
    'https://localhost:8081', // Docker HTTPS
  ],
  apiUrl: 'https://localhost:7257', // Default fallback
  apiTimeout: 5000, // Timeout for API health check in ms
};
