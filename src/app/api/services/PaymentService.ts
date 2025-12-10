/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { PaymentRequest } from '../models/PaymentRequest';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiV1Payments(
        requestBody?: PaymentRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/v1/payments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param invoiceId
     * @returns any Success
     * @throws ApiError
     */
    public getApiV1PaymentsInvoice(
        invoiceId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/payments/invoice/{invoiceId}',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
    /**
     * @param orgId
     * @returns any Success
     * @throws ApiError
     */
    public getApiV1PaymentsOrg(
        orgId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/payments/org/{orgId}',
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
    public getApiV1Payments(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/v1/payments/{id}',
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
    public putApiV1Payments(
        id: string,
        requestBody?: PaymentRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/api/v1/payments/{id}',
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
    public deleteApiV1Payments(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/v1/payments/{id}',
            path: {
                'id': id,
            },
        });
    }
}
