/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Invoice } from './Invoice';
import type { Organization } from './Organization';
export type Vendor = {
    id?: string;
    orgId?: string | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    category?: string | null;
    createdAt?: string | null;
    invoices?: Array<Invoice> | null;
    org?: Organization;
};

