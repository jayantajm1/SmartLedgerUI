/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Invoice } from './Invoice';
export type Payment = {
    id?: string;
    invoiceId?: string | null;
    amount?: number;
    paymentDate?: string;
    method?: string | null;
    reference?: string | null;
    createdAt?: string | null;
    invoice?: Invoice;
};

