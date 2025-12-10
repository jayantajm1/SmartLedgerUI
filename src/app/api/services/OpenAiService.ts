/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { AnalyzeInvoiceRequest } from '../models/AnalyzeInvoiceRequest';
import type { CashflowRequest } from '../models/CashflowRequest';
import type { ChatRequest } from '../models/ChatRequest';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class OpenAiService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiOpenAiChat(
        requestBody?: ChatRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/OpenAI/chat',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiOpenAiAnalyzeInvoice(
        requestBody?: AnalyzeInvoiceRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/OpenAI/analyze-invoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiOpenAiPredictCashflow(
        requestBody?: CashflowRequest,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/OpenAI/predict-cashflow',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
