import { oas31 } from 'openapi3-ts';
import * as fs from 'fs';
import * as path from 'path';
import { schemas } from './schemas';

const apiData: ApiData = require('./compiler');

export interface MethodData {
    params?: Record<string, string>;
    response?: Record<string, any>;
}

export interface Endpoints {
    [endpoint: string]: {
        [method: string]: MethodData;
    };
}

export interface ApiData {
    [section: string]: Endpoints;
}

// Base Template
const createBasicTemplate = (): oas31.OpenAPIObject => ({
    openapi: '3.0.0',
    info: {
        title: 'Rocket Chat API',
        version: '1.0.0',
        description: 'This is a sample API Documentation'
    },
    servers: [{
        url: "https://apiexplorer.support.rocket.chat/"
    }],
    paths: {},
    components: {
        schemas: schemas
    }
});

// Type mapping
const paramTypeMap: { [key: string]: string } = {
    "IRoom['_id']": 'string',
    "string": 'string',
    "boolean": 'boolean',
    "IUser['username'][]": 'array',
    "number": 'integer'
};

const paramFormatMap: { [key: string]: string | undefined } = {
    "integer": 'int32'
};

// Helper function to create a parameter object
const createParameterObject = (name: string, type: string, isRequired: boolean): oas31.ParameterObject => {
    const isArray = type.endsWith('[]');
    return {
        name,
        in: 'query',
        required: isRequired,
        schema: {
            type: isArray ? 'array' : paramTypeMap[type],
            format: paramFormatMap[paramTypeMap[type]],
            ...(isArray ? { items: { type: paramTypeMap[type.slice(0, -2)] } } : {})
        }
    };
};

// Helper function to create a schema object for requestBody
const createRequestBodySchema = (params: Record<string, string>): oas31.SchemaObject => {
    const schema: oas31.SchemaObject = { type: 'object', properties: {}, required: [] };
    for (const [key, value] of Object.entries(params)) {
        const isArray = value.endsWith('[]');
        const type = paramTypeMap[isArray ? value.slice(0, -2) : value];
        schema.properties![key] = {
            type: isArray ? 'array' : type,
            format: paramFormatMap[type],
            ...(isArray ? { items: { type } } : {})
        };
        if (!value.includes('?')) {
            schema.required!.push(key);
        }
    }
    return schema;
};

// Helper function to create a schema object for responses
const createResponseSchema = (response: Record<string, any>): oas31.SchemaObject => {
    const unionSchemas: oas31.SchemaObject[] = [];
    for (const [key, value] of Object.entries(response)) {
        if (typeof value === 'object' && value !== null) {
            const schema: oas31.SchemaObject = { type: 'object', properties: {} };
            for (const [subKey, subValue] of Object.entries(value)) {
                const isArray = subValue.endsWith('[]');
                const type = paramTypeMap[isArray ? subValue.slice(0, -2) : subValue];
                schema.properties![subKey] = {
                    type: isArray ? 'array' : type,
                    format: paramFormatMap[type],
                    ...(isArray ? { items: { type } } : {})
                };
            }
            unionSchemas.push(schema);
        } else if (value === 'void') {
            unionSchemas.push({ type: 'null' });
        }
    }
    if (unionSchemas.length === 1) {
        return unionSchemas[0];
    }
    return { oneOf: unionSchemas };
};

// Function to process and add endpoints to the OpenAPI spec
const processEndpoints = (endpoints: Endpoints, tag: string): Record<string, oas31.PathItemObject> => {
    const paths: Record<string, oas31.PathItemObject> = {};

    for (const [endpoint, methods] of Object.entries(endpoints)) {
        const pathItem: oas31.PathItemObject = {};

        for (const [method, methodData] of Object.entries(methods)) {
            const isGetMethod = method === 'GET';
            const parameters = isGetMethod ? Object.entries(methodData.params || {}).map(([key, value]) =>
                createParameterObject(key, value, !value.includes('?'))
            ) : undefined;

            const requestBodySchema = isGetMethod ? undefined : createRequestBodySchema(methodData.params || {});
            const responseSchema = createResponseSchema(methodData.response || {});

            const operation: oas31.OperationObject = {
                tags: [tag],
                requestBody: isGetMethod ? undefined : {
                    content: {
                        'application/json': {
                            schema: requestBodySchema
                        }
                    }
                },
                parameters: parameters,
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

            pathItem[method.toLowerCase() as keyof oas31.PathItemObject] = operation;
        }

        paths[endpoint] = pathItem;
    }

    return paths;
};

// Generate the OpenAPI document
const generateApiDoc = (apiData: ApiData): oas31.OpenAPIObject => {
    const openApiTemplate = createBasicTemplate();

    for (const [section, endpoints] of Object.entries(apiData)) {
        const tag = section;
        const paths = processEndpoints(endpoints, tag);
        openApiTemplate.paths = { ...openApiTemplate.paths, ...paths };
    }

    return openApiTemplate;
};

const openApiDoc = generateApiDoc(apiData);
const JsonDoc = JSON.stringify(openApiDoc, null, 2);

// Code to output generated file to folder
const outputFolder = path.join(__dirname, '../oas');
const outputFilePath = path.join(outputFolder, `openapispec.json`);

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}
fs.writeFileSync(outputFilePath, JsonDoc, 'utf-8');
