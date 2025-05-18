export interface UserPayload {
    id: string;
    username: string;
    roles: string[];
    [key: string]: any;
}
