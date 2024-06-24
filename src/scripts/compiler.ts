import * as path from "path";
import * as ts from 'typescript';
import { isSymbolObject } from "util/types";

const fileName = path.join(__dirname, '../scripts/sourcefiles.ts');

// Read the file content
const fileContent = ts.sys.readFile(fileName);

if (!fileContent) {
    console.error(`Could not read file: ${fileName}`);
    process.exit(1);
}

// Create a SourceFile object
const sourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true);

const program = ts.createProgram([fileName],{
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS
})

const checker = program.getTypeChecker();

// Add cache for already processed types
const processedTypes = new Map<string, any>(); 

//Function to extract Data from Referenced Endpoints 
const extractReferencedNode = (typeNode: ts.TypeReferenceNode | undefined) => {
    const temp:any = {};
    if(!typeNode) return temp;

    const type = checker.getTypeAtLocation(typeNode)
    if (!type) return typeNode.getText();

    const aliasSymbol = type.aliasSymbol;
    if(!aliasSymbol) return typeNode.getText();

    // find a way to get the properties using the symbol
    console.log(aliasSymbol);
        
    return temp;
}

// Function to extract endpoints from the AST
const extractEndpoints = (node: ts.Node, endpoints: any = {}) => {
    const regex = /.*Endpoints$/;

    if (ts.isTypeAliasDeclaration(node) && regex.test(node.name.text)) {
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

                        let params = {}; // change it to object and add params as key val;                        
                        method.parameters.map(param => {
                            let paramType;
                            if(ts.isTypeReferenceNode(param.type)){ // handle case when parameters are not given directly
                                paramType = param.type as ts.TypeReferenceNode;
                                params = paramType.typeName?.getText();
                                // const temp = extractReferencedNode(paramType);
                                // Object.assign(params, temp);
                            }else{
                                paramType = param.type as ts.TypeLiteralNode;
                                if(typeof(paramType.members)==="object"){
                                    paramType.members.forEach(paramMember => {
                                        if(ts.isPropertySignature(paramMember) && paramMember.name && ts.isIdentifier(paramMember.name)){
                                            const paramKey = paramMember.name.escapedText as string;
                                            const paramValue = paramMember.type?.getText();
    
                                            const temp:any = {};
                                            temp[paramKey] = paramValue;
                                            Object.assign(params, temp);
                                        }
                                    })
                                }
                            }
                        });
                        // console.log(`params: ${JSON.stringify(params)}`);

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
                                    const temp:any = {};
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

function getFormatedFilename(path:string) {
    // Extract the last part of the path
    const parts = path.split('/');
    const filenameWithExtension = parts.pop();
  
    // Remove the file extension
    if(!filenameWithExtension) return "noName";
    const filename = filenameWithExtension.replace(/\.[^/.]+$/, "Endpoints");
  
    return filename;
}

const endpoints:any = {};
program.getSourceFiles().filter(file=>!file.isDeclarationFile).map(f=> {
    const filename = getFormatedFilename(f.fileName);
    const temp = {};
    extractEndpoints(f, temp);
    
    if(Object.keys(temp).length) endpoints[filename] = temp;
});

// console.log(JSON.stringify(endpoints));

module.exports =  endpoints;

// console.log(JSON.stringify(endpoints, null, 2));
// const openSpecRoomData; // use it to store all the data, so that it can be used in openapi3-ts
// for(var key in endpoints){
//     console.log(`endpoint: ${key}`); 
    
//     for(var k in endpoints[key]){
//         console.log(`method: ${k}`);
//         console.log(`params: ${JSON.stringify(endpoints[key][k].params)}`);

//         console.log(`response: ${JSON.stringify(endpoints[key][k].response)}`);
        
//     }
//     console.log('\n\n');   
// }