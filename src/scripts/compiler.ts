import * as path from "path";
import * as ts from 'typescript';

const fileName = path.join(__dirname, '../scripts/sourcefiles.ts');

const fileContent = ts.sys.readFile(fileName);

if (!fileContent) {
    console.error(`Could not read file: ${fileName}`);
    process.exit(1);
}

const sourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true);

const program = ts.createProgram([fileName],{
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS
})

const checker = program.getTypeChecker();

// Add cache for already processed types
const processedTypes = new Map<string, any>(); 

const extractReferencedNode = (typeNode: ts.Identifier) => {
    if(!typeNode) return {};

    let params:any = {};
    const symbol = checker.getSymbolAtLocation(typeNode)
    if (!symbol) return typeNode.getText();
    
    // need to check if "aliasSymbol" exists from the getTypeAtLocation() function
    // if symbol and aliasSymbol are different first get the referenced parent symbol then parse

    symbol.declarations?.map(sym => {
        if(ts.isTypeAliasDeclaration(sym) && sym.name && ts.isIdentifier(sym.name)){
            let temp:any = {};

            // handle case for union type => add them to array
            // and these types can be nested so its better to write a recursive function rather than handling with if else // 
            if(ts.isTypeReferenceNode(sym.type)){
                const symbolType = sym.type as ts.TypeReferenceNode;            

                symbolType.typeArguments?.forEach(symbolTypeArguments => {
                    if(ts.isTypeLiteralNode(symbolTypeArguments)){
                        symbolTypeArguments.members.forEach(symbolMember => {
                            if(ts.isPropertySignature(symbolMember) && symbolMember.name && ts.isIdentifier(symbolMember.name)){
                                const key = symbolMember.name.text;
                                const type = checker.getTypeAtLocation(symbolMember.type!)
                                const value = checker.typeToString(type);
                                temp[key] = value;
                                
                                Object.assign(params, temp);
                            }
                        })
                    }
                })
            }else{
                const symbolType = sym.type as ts.TypeLiteralNode; 
    
                symbolType.members?.forEach(symbolMember => {
                    if(ts.isPropertySignature(symbolMember) && symbolMember.name && ts.isIdentifier(symbolMember.name)){
                        const key = symbolMember.name.text;
                        const type = checker.getTypeAtLocation(symbolMember.type!)
                        const value = checker.typeToString(type);
                        temp[key] = value;
                        
                        Object.assign(params, temp);
                    }
                })
            }
        }
    })    
        
    return params;
}

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

                        let params = {};                       
                        method.parameters.map(param => {
                            if(ts.isTypeReferenceNode(param.type!)){
                                const paramType = param.type as ts.TypeReferenceNode;
                                const paramTypeName = paramType.typeName as ts.Identifier;
                                
                                const paramMembers = extractReferencedNode(paramTypeName);
                                Object.assign(params, paramMembers);
                            }else{
                                const paramType = param.type as ts.TypeLiteralNode;
                                // check if nested objects are getting parsed, if not convert this into a function and use recursion // 
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

                        let response: any = {};
                        // can also be of union type //
                        if(ts.isTypeLiteralNode(method.type)){
                            const responseType = method.type as ts.TypeLiteralNode;

                            // check if nested objects are getting parsed, if not convert this into a function and use recursion //
                            if(typeof(responseType.members)==="object"){
                                responseType.members.map( res => {
                                    if(ts.isPropertySignature(res) && res.name && ts.isIdentifier(res.name)){
                                        const key = res.name?.getText();
                                        const resType = res.type as ts.ArrayTypeNode;
                                        const val = resType.getText();
                                    
                                        const temp:any = {};
                                        temp[key] = val;
                                        Object.assign(response, temp);
                                    }
                                })
                            }
                        }else if(ts.isUnionTypeNode(method.type)){
                            const responseTypes = method.type as ts.UnionTypeNode;
                            
                            const types:any = [];
                            responseTypes.types.forEach(responseType => {
                                let temp:any = {}
                                if(ts.isTypeLiteralNode(responseType)){
                                   responseType.members.forEach(res => {
                                        if(ts.isPropertySignature(res) && res.name && ts.isIdentifier(res.name)){
                                            const key = res.name.text;
                                            const type = checker.getTypeAtLocation(res.type!)
                                            const value = checker.typeToString(type);
                                            temp[key] = value;
                                        }
                                   })
                                }else{
                                    // nullish or simple type
                                    const type = checker.getTypeAtLocation(responseType)
                                    const value = checker.typeToString(type);
                                    temp = value;
                                }

                                types.push(temp);
                            })

                            Object.assign(response, types);
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
    const parts = path.split('/');
    const filenameWithExtension = parts.pop();
  
    if(!filenameWithExtension) return console.error("No fileName Found");
    const filename = filenameWithExtension.replace(/\.[^/.]+$/, "Endpoints");
  
    return filename;
}

const endpoints:any = {};
program.getSourceFiles().filter(file=>!file.isDeclarationFile).map(f=> {
    const filename:string = getFormatedFilename(f.fileName) as string;
    const temp = {};
    extractEndpoints(f, temp);
    
    if(Object.keys(temp).length) endpoints[filename] = temp;
});

console.log(JSON.stringify(endpoints));

module.exports =  endpoints;

// TODO:
// first handle AliasSymbol and Union Type
// Then focus on other edge cases like PaginatedResults