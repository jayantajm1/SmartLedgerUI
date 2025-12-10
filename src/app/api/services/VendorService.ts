/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { VendorRequest } from '../models/VendorRequest';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class VendorService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param orgId
     * @returns any Success
     * @throws ApiError
     */
    public getApiVendors(
        orgId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/vendors/{orgId}',
            path: {
                'orgId': orgId,
            },
        });
    }
    /**
     * @param orgId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiVendors(
        orgId: string,
        requestBody?: VendorRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/vendors/{orgId}',
            path: {
                'orgId': orgId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public getApiVendorsDetail(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/vendors/detail/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public putApiVendors(
        id: string,
        requestBody?: VendorRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/api/vendors/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiVendors(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/vendors/{id}',
            path: {
                'id': id,
            },
        });
    }
}
