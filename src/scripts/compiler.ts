import * as path from "path";
import * as ts from 'typescript';

const fileName = path.join(__dirname, '../types/room.ts');

// Read the file content
const fileContent = ts.sys.readFile(fileName);

if (!fileContent) {
    console.error(`Could not read file: ${fileName}`);
    process.exit(1);
}

// Create a SourceFile object
const sourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true);

// Function to extract endpoints from the AST
const extractEndpoints = (node: ts.Node, endpoints: any = {}) => {
    if (ts.isTypeAliasDeclaration(node) && node.name.escapedText === 'RoomsEndpoints') { // Here rather than RomsEndpoints use ReGex 
        const typeLiteral = node.type as ts.TypeLiteralNode;

        typeLiteral.members.forEach(member => {
            if (ts.isPropertySignature(member) && member.name && ts.isStringLiteral(member.name)) {
                const key = member.name.text;
                const methodType = member.type as ts.TypeLiteralNode;

                endpoints[key] = {};

                methodType.members.forEach(methodMember => {
                    if (ts.isPropertySignature(methodMember) && methodMember.name && ts.isIdentifier(methodMember.name)) {
                        const methodName = methodMember.name.escapedText as string;
                        const method = methodMember.type as ts.FunctionTypeNode;

                        let params; // change it to object and add params as key val;                        
                        method.parameters.map(param => {
                            const paramType = param.type as ts.TypeReferenceNode;
                            params = paramType.typeName?.getText();
                            // rather than getText() here try to use `Alias Symbol` to get the definitaion from the function.
                            // Then we can get its children through recursion
                        });
                        // console.log(`params: ${params}`);

                        const responseType = method.type as ts.TypeLiteralNode;

                        let response: any = {};
                        // console.log(typeof(responseType.members));
                        if(typeof(responseType.members)==="object"){
                            responseType.members.map( res => {
                                // response obj for each member and add it to some parent response object //
                                if(ts.isPropertySignature(res) && res.name && ts.isIdentifier(res.name)){
                                    const key = res.name?.getText();
                                    const resType = res.type as ts.ArrayTypeNode;
                                    const val = resType.getText();
                                    // console.log(`key: ${key}, val: ${val}`);
                                    const temp = {};
                                    temp[key] = val;
                                    Object.assign(response, temp);
                                }
                            })
                        }
                        
                        endpoints[key][methodName] = {
                            params,
                            response
                        };
                    }
                });
            }
        });
    }

    ts.forEachChild(node, childNode => extractEndpoints(childNode, endpoints));
};

const endpoints = {};
extractEndpoints(sourceFile, endpoints);

// console.log(JSON.stringify(endpoints, null, 2));

for(var key in endpoints){
    console.log(`endpoint: ${key}`); 
    
    for(var k in endpoints[key]){
        console.log(`method: ${k}`);
        console.log(`params: ${endpoints[key][k].params}`);

        console.log(`response: ${JSON.stringify(endpoints[key][k].response)}`);
        
    }
    console.log('\n\n');   
}