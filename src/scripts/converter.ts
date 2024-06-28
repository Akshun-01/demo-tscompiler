import { oas31 } from 'openapi3-ts';
import * as fs from 'fs';
import * as path from 'path';
import { schemas } from './schemas'; 

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

// Base Template
const createBasicTemplate = (): oas31.OpenAPIObject => {
    return {
        openapi: '3.0.0',
        info: {
            title: 'Rocket Chat API',
            version: '1.0.0',
            description: 'This is a sample API'
        },
        servers:[{
            url: "https://apiexplorer.support.rocket.chat/"
        }],
        paths: {},
        components:{
            schemas: schemas
        }
    };
};

// Function to process and add endpoints to the OpenAPI spec
const processEndpoints = (endpoints: Endpoints, tag: string): Record<string, oas31.PathItemObject> => {
    const paths: Record<string, oas31.PathItemObject> = {};

    for (const [endpoint, methods] of Object.entries(endpoints)) {
        const pathItem: oas31.PathItemObject = {};

        // add parameters //
        
        for (const [method, methodData] of Object.entries(methods)) {
            const requestBodySchema: oas31.SchemaObject = {
                type: 'object',
                properties: {},
                required: []
            };

            if (methodData.params && typeof methodData.params === 'string') {
                requestBodySchema.properties = {
                    [methodData.params]: { type: 'string' } // Temporary for now, add recurrsion later and update
                };
                requestBodySchema.required = [methodData.params];
            } else if (methodData.params) {
                for (const [key, value] of Object.entries(methodData.params)) { 
                    requestBodySchema.properties![key] = { value };
                    
                    /* can add ?: to make param optional */
                    if (!value.includes('?')) {
                        requestBodySchema.required!.push(key);
                    }
                }
            }

            const responseSchema: oas31.SchemaObject = {
                type: 'object',
                properties: {}
            };

            for (const [key, value] of Object.entries(methodData.response || {})) {
                let $ref = value;
                // use logic here: If it starts with "I" the use appropriate schema, if it has ["id"] parse it as string //
                if(["IRoom[]", "IRoom"].includes(value)){
                    $ref = "#/components/schemas/IRoom"
                }else if(["IUser[]", "IUser"].includes(value)){
                    $ref = "#/components/schemas/IUser"
                }
                responseSchema.properties![key] = { $ref };
            }

            const operation: oas31.OperationObject = {
                summary: `${method} ${endpoint}`,
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
const JsonDoc = JSON.stringify(openApiDoc);

// Code to output generated file to folder
const outputFolder = path.join(__dirname, '../oas');
const outputFilePath = path.join(outputFolder, `openapispec.json`);
    
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}
fs.writeFileSync(outputFilePath, JsonDoc, 'utf-8');
