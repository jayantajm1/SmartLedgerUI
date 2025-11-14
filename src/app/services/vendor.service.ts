import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient) {}
  // Add methods to interact with VendorController
}
