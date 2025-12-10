/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
export type CashflowPrediction = {
    id?: string;
    orgId?: string | null;
    month?: string;
    projectedInflow?: number | null;
    projectedOutflow?: number | null;
    confidence?: number | null;
    generatedAt?: string | null;
    org?: Organization;
};

