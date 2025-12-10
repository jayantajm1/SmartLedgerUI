/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
export type User = {
    id?: string;
    name?: string | null;
    email?: string | null;
    passwordHash?: string | null;
    role?: string | null;
    orgId?: string | null;
    createdAt?: string | null;
    org?: Organization;
};

