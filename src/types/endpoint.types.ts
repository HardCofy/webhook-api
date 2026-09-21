export interface Endpoint {
    id: string;
    name: string;
    url: string;
    secret: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface updateEndpointInput {
    name?: string;
    url?: string;
    secret?: string;
}