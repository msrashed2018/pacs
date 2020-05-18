export class ApplicationEntity {
    id: number;
    title: string;
    hostname: string = "127.0.0.1";
    port: string;
    description: string;
    // storagePath: string;
    status: boolean;
}
