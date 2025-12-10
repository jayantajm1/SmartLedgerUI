/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CashflowPrediction } from './CashflowPrediction';
import type { Invoice } from './Invoice';
import type { User } from './User';
import type { Vendor } from './Vendor';
export type Organization = {
    id?: string;
    name?: string | null;
    industry?: string | null;
    gstNumber?: string | null;
    country?: string | null;
    plan?: string | null;
    createdAt?: string | null;
    cashflowPredictions?: Array<CashflowPrediction> | null;
    invoices?: Array<Invoice> | null;
    users?: Array<User> | null;
    vendors?: Array<Vendor> | null;
};

