import { oas31 } from 'openapi3-ts';
import * as fs from 'fs';
import * as path from 'path';

const apiData:ApiData = require('./compiler')

export interface MethodData {
    params?: Record<string, string> | string;
    response?: Record<string, string>;
}

export interface Endpoints {
    [endpoint: string]: {
        [method: string]: MethodData;
    };
}

export interface ApiData {
    [section: string]: Endpoints;
}

// Function to create a basic OpenAPI template
const createBasicTemplate = (): oas31.OpenAPIObject => {
    return {
        openapi: '3.0.0',
        info: {
            title: 'Rocket Chat API',
            version: '1.0.0',
            description: 'This is a sample API'
        },
        paths: {}
    };
};

// Function to process and add endpoints to the OpenAPI spec
const processEndpoints = (endpoints: Endpoints, tag: string): Record<string, PathItemObject> => {
    const paths: Record<string, PathItemObject> = {};

    for (const [endpoint, methods] of Object.entries(endpoints)) {
        const pathItem: PathItemObject = {};

        for (const [method, methodData] of Object.entries(methods)) {
            const requestBodySchema: SchemaObject = {
                type: 'object',
                properties: {},
                required: []
            };

            if (methodData.params && typeof methodData.params === 'string') {
                requestBodySchema.properties = {
                    [methodData.params]: { type: 'string' } // Assuming a simple string for the placeholder
                };
                requestBodySchema.required = [methodData.params];
            } else if (methodData.params) {
                for (const [key, value] of Object.entries(methodData.params)) {
                    const type = value.replace(/\[.*\]/, '').toLowerCase(); // Remove type reference brackets and convert to lower case
                    requestBodySchema.properties[key] = { type };
                    if (!value.includes('?')) { // Assuming '?' denotes optional params
                        requestBodySchema.required!.push(key);
                    }
                }
            }

            const responseSchema: SchemaObject = {
                type: 'object',
                properties: {}
            };

            for (const [key, value] of Object.entries(methodData.response || {})) {
                let type = value.replace(/\[.*\]/, '').toLowerCase(); // Remove type reference brackets and convert to lower case
                if (['array', 'boolean', 'integer', 'number', 'object', 'string'].includes(type)) {
                    responseSchema.properties![key] = { type };
                } else {
                    responseSchema.properties![key] = { type: 'object' }; // Default to 'object' if type is unknown
                }
            }

            const operation: OperationObject = {
                summary: `${method} ${endpoint}`,
                operationId: `${method.toLowerCase()}${endpoint.replace(/\//g, '_')}`,
                tags: [tag],
                requestBody: method !== 'GET' && Object.keys(requestBodySchema.properties).length ? {
                    content: {
                        'application/json': {
                            schema: requestBodySchema
                        }
                    }
                } : undefined,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: responseSchema
                            }
                        }
                    }
                }
            };

            pathItem[method.toLowerCase() as keyof PathItemObject] = operation;
        }

        paths[endpoint] = pathItem;
    }

    return paths;
};

// Generate the OpenAPI document
const generateApiDoc = (apiData: ApiData): OpenAPIObject => {
    const openApiTemplate = createBasicTemplate();

    for (const [section, endpoints] of Object.entries(apiData)) {
        const tag = section; // Use the section name as the tag
        const paths = processEndpoints(endpoints, tag);
        openApiTemplate.paths = { ...openApiTemplate.paths, ...paths };
    }

    return openApiTemplate;
};

const openApiDoc = generateApiDoc(apiData);
const JsonDoc = JSON.stringify(openApiDoc);

// Code to output generated file to folder
const outputFolder = path.join(__dirname, '../oas');
const outputFilePath = path.join(outputFolder, `openapispec.json`);
    
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}
fs.writeFileSync(outputFilePath, JsonDoc, 'utf-8');
