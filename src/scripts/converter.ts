import { oas31 } from 'openapi3-ts';
import * as fs from 'fs';
import * as path from 'path';

const apiData = require('./compiler')

interface MethodData {
    params: string | Record<string, string>;
    response: Record<string, string>;
}

interface ApiData {
    [endpoint: string]: {
        [method: string]: MethodData;
    };
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
        // servers: [
        //     {
        //         url: 'https://api.example.com'
        //     }
        // ],
        paths: {}
    };
};

// Function to generate OpenAPI documentation based on provided API data
const generateApiDoc = (apiData: ApiData): oas31.OpenAPIObject => {
    const openApiTemplate = createBasicTemplate();

    for (const [endpoint, methods] of Object.entries(apiData)) {
        const pathItem: oas31.PathItemObject = {};

        for (const [method, methodData] of Object.entries(methods)) {
            const requestBodySchema: oas31.SchemaObject = {
                type: 'object',
                properties: {},
                required: []
            };

            if (typeof methodData.params === 'string') {
                requestBodySchema.properties = {
                    [methodData.params]: { type: 'string' } // Assuming a simple string for the placeholder
                };
                requestBodySchema.required = [methodData.params];
            } else {
                for (const [key, value] of Object.entries(methodData.params)) {
                    const type = value.replace(/\[.*\]/, '').toLowerCase(); // Remove type reference brackets and convert to lower case
                    requestBodySchema.properties![key] = { type };
                    if (!value.includes('?')) { // Assuming '?' denotes optional params
                        requestBodySchema.required!.push(key);
                    }
                }
            }

            const responseSchema: oas31.SchemaObject = {
                type: 'object',
                properties: {}
            };

            for (const [key, value] of Object.entries(methodData.response)) {
                const type = value.replace(/\[.*\]/, '').toLowerCase(); // Remove type reference brackets and convert to lower case
                responseSchema.properties![key] = { type };
            }

            const operation: oas31.OperationObject = {
                summary: `${method} ${endpoint}`,
                operationId: `${method.toLowerCase()}${endpoint.replace(/\//g, '_')}`,
                requestBody: {
                    content: {
                        'application/json': {
                            schema: requestBodySchema
                        }
                    }
                },
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

            pathItem[method.toLowerCase()] = operation;
        }

        openApiTemplate.paths[endpoint] = pathItem;
    }

    return openApiTemplate;
};

const openApiDoc = generateApiDoc(apiData);
// console.log(openApiDoc);
const JsonDoc = JSON.stringify(openApiDoc);

// Define the output folder and file path
const outputFolder = path.join(__dirname, '../oas');
const outputFilePath = path.join(outputFolder, `RoomEndpoints.json`);
    
// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}
// Write the JSON string to the output file
fs.writeFileSync(outputFilePath, JsonDoc, 'utf-8');
console.log(`OpenAPI document has been saved to ${outputFilePath}`);