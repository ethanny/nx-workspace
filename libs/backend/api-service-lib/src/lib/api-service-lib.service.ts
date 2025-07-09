/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiServiceLibService {

    private readonly logger = new Logger(ApiServiceLibService.name);
 

   
    async post(endpoint: string, data: any, headers?: HeadersInit): Promise<Response> {

        this.logger.log(`Posting to ${endpoint}`);
       
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Attempt to read the error body
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (e) {
                errorBody = await response.text();
            }

            // Log the full response for debugging
            this.logger.error('Error response:', {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: errorBody,
            });

            throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(errorBody)}`);
        }

        return response;
    }
}