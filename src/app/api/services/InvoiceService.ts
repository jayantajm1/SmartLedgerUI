/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Invoice } from '../models/Invoice';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param orgId
     * @returns any Success
     * @throws ApiError
     */
    public getApiV1Invoices(
        orgId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/invoices/{orgId}',
            path: {
                'orgId': orgId,
            },
        });
    }
    /**
     * @param id
     * @returns any Success
     * @throws ApiError
     */
    public getApiV1InvoicesDetails(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/invoices/details/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiV1Invoices(
        requestBody?: Invoice,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/invoices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public putApiV1Invoices(
        id: string,
        requestBody?: Invoice,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/api/v1/invoices/{id}',
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
    public deleteApiV1Invoices(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/v1/invoices/{id}',
            path: {
                'id': id,
            },
        });
    }
}
