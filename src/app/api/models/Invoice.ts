/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
import type { Payment } from './Payment';
import type { Vendor } from './Vendor';
export type Invoice = {
    id?: string;
    orgId?: string | null;
    vendorId?: string | null;
    invoiceNumber?: string | null;
    dateIssued?: string | null;
    dueDate?: string | null;
    totalAmount?: number | null;
    currency?: string | null;
    status?: string | null;
    category?: string | null;
    ocrText?: string | null;
    aiSummary?: string | null;
    anomalyScore?: number | null;
    createdAt?: string | null;
    org?: Organization;
    payments?: Array<Payment> | null;
    vendor?: Vendor;
};

