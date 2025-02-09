interface UploadParams {
    projectId: string;
    serviceId: string;
    environmentId: string;
    zeaburApiKey: string;
    codeZip: string;
}
interface DeployResponse {
    url?: string;
    error?: string;
    errors?: {
        extensions: {
            code: string;
        };
    }[];
    message?: string;
}
export declare function upload({ projectId, serviceId, environmentId, zeaburApiKey, codeZip }: UploadParams): Promise<DeployResponse>;
export {};
