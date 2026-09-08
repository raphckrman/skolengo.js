/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module RESTManager */
import { RequestOptions } from "../types/RequestHandler";

export class RestManager {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async sendRequest<T>(options: RequestOptions): Promise<T> {
        const { method, path, body, headers } = options;
        const url = `${this.baseURL}/${path}`;

        let requestBody: unknown = undefined;
        let requestHeaders: Record<string, string> = {
          "User-Agent": "@raphckrman/skolengo.js",
          ...headers,
        };

        if (body instanceof URLSearchParams) {
          requestBody = body.toString();
          requestHeaders["Content-Type"] = "application/x-www-form-urlencoded";
        } else if (body) {
          requestBody = JSON.stringify(body);
          requestHeaders["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
            method,
            body: requestBody,
            headers: requestHeaders,
            credentials: "omit"
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`${response.status}: ${JSON.stringify(responseData)}`);
        }

        const responseData = await response.json();
        return responseData as T;
    }

    async delete<T>(path: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
        const urlParams = new URLSearchParams(params).toString();
        const urlPath = urlParams ? `${path}?${urlParams}` : path;
        return this.sendRequest<T>({
            method:  "DELETE",
            path:    urlPath,
            headers: options?.headers
        });
    }
    async get<T>(path: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
        const urlParams = new URLSearchParams(params).toString();
        const urlPath = urlParams ? `${path}?${urlParams}` : path;
        return this.sendRequest<T>({
            method: "GET",
            path:   urlPath,
            headers
        });
    }

    async post<T>(path: string, body: any, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
        const urlParams = new URLSearchParams(params).toString();
        const urlPath = urlParams ? `${path}?${urlParams}` : path;
        return this.sendRequest<T>({
            method:  "POST",
            path: urlPath,
            body,
            headers: options?.headers
        });
    }

    async put<T>(path: string, body: any, options?: RequestOptions): Promise<T> {
        return this.sendRequest<T>({
            method:  "PUT",
            path,
            body,
            headers: options?.headers
        });
    }

    async patch<T>(path: string, body: any, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
        const urlParams = new URLSearchParams(params).toString();
        const urlPath = urlParams ? `${path}?${urlParams}` : path;
        return this.sendRequest<T>({
            method:  "PATCH",
            path: urlPath,
            body,
            headers: options?.headers
        });
    }
}
