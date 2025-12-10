/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class CashflowPredictionService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param orgId
     * @returns any Success
     * @throws ApiError
     */
    public getApiCashflowPrediction(
        orgId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/CashflowPrediction/{orgId}',
            path: {
                'orgId': orgId,
            },
        });
    }
    /**
     * @param orgId
     * @param year
     * @param month
     * @returns any Success
     * @throws ApiError
     */
    public getApiCashflowPrediction1(
        orgId: string,
        year: number,
        month: number,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/CashflowPrediction/{orgId}/{year}/{month}',
            path: {
                'orgId': orgId,
                'year': year,
                'month': month,
            },
        });
    }
    /**
     * @param orgId
     * @returns any Success
     * @throws ApiError
     */
    public postApiCashflowPredictionGenerate(
        orgId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/CashflowPrediction/generate/{orgId}',
            path: {
                'orgId': orgId,
            },
        });
    }
}
