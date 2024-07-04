import * as path from "path";
import * as ts from "typescript";

const fileName = path.join(__dirname, "../scripts/sourcefiles.ts");
const fileContent = ts.sys.readFile(fileName);
if (!fileContent) {
  console.error(`Could not read file: ${fileName}`);
  process.exit(1);
}

const program = ts.createProgram([fileName], {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
});
const checker = program.getTypeChecker();

/* ###################################################################################### */
const extractLiteralNode = (typeNode: ts.TypeLiteralNode, properties: any = {}) => {
    if (!typeNode) return {};
  
    typeNode.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name)) {
        const key = member.name.text;
        const type = member.type;
        if(!type){
          console.error(`Type value not present at: ${key}`);
          return;
        }

        const temp:any = {};
        if(ts.isTypeLiteralNode(type)){
          const subTemp:any = {};
          extractLiteralNode(type, subTemp);
          temp[key] = subTemp;
        }else{
          const valueType = checker.getTypeAtLocation(type);
          const value = checker.typeToString(valueType);
          temp[key] = value;
        }

        Object.assign(properties, temp)
      }
    });
};

const extractImportedNode = (typenode: ts.ImportSpecifier, params:any = {}) => {
  let importedSymbol = checker.getSymbolAtLocation(typenode.name);
  if(!importedSymbol) return typenode.getText();

  const importedAliasSymbol = checker.getAliasedSymbol(importedSymbol);
  const declarations = importedAliasSymbol.getDeclarations();

  if(!declarations) return typenode.getText();

  declarations.forEach((sym) => {
    let temp: any = {};
    if(ts.isTypeAliasDeclaration(sym) && sym.name && ts.isIdentifier(sym.name)) {
      const symbolType = sym.type;
      if (!symbolType) return {};

      if (ts.isTypeReferenceNode(symbolType)) {
          extractReferencedNode(symbolType, temp);
      } else if (ts.isTypeLiteralNode(symbolType)) {
        extractLiteralNode(symbolType, temp);
      } else if (ts.isUnionTypeNode(symbolType)) {
          const unionArr:any = [];
          symbolType.types.forEach(type => {
              const unionTemp:any = {};
              if(ts.isTypeLiteralNode(type)){
                  extractLiteralNode(type, unionTemp);
              }else if(ts.isTypeReferenceNode(type)){
                  extractReferencedNode(type, unionTemp);
              }
              unionArr.push(unionTemp);
          })
          temp["unionTypes"] = unionArr;
      }

    }
    Object.assign(params, temp);
  });

}

const processedTypes = new Map<string, any>(); // Add cache for already processed types
const extractReferencedNode = (typeNode: ts.TypeReferenceNode,params: any = {}) => {
  if (!typeNode) return {};

  if (typeNode.typeArguments) {
    // it is from symbol and we need to extract and return
    typeNode.typeArguments.forEach((arg) => {
        if(ts.isTypeLiteralNode(arg)) {
            extractLiteralNode(arg, params);
        }else if(ts.isTypeReferenceNode(arg)){
            extractReferencedNode(arg, params);
        }
    });
  } else {
    // get symbol and parse it //
    const typeIdentifier = typeNode.typeName;
    let symbol = checker.getSymbolAtLocation(typeIdentifier);
    if (!symbol) return typeNode.getText();

    const type = checker.getTypeAtLocation(typeNode);
    const aliasSymbol = type.aliasSymbol;
    if(aliasSymbol && (typeIdentifier.getText() !== aliasSymbol?.escapedName)){
        symbol = aliasSymbol;
    }

    symbol.declarations?.forEach((sym) => {
      let temp: any = {};

      if(ts.isImportSpecifier(sym) && sym.name && ts.isIdentifier(sym.name)){
        extractImportedNode(sym, temp);
      }else if(ts.isTypeAliasDeclaration(sym) && sym.name && ts.isIdentifier(sym.name)) {
        const symbolType = sym.type;
        if (!symbolType) return {};

        if (ts.isTypeReferenceNode(symbolType)) {
            extractReferencedNode(symbolType, temp);
        } else if (ts.isTypeLiteralNode(symbolType)) {
          extractLiteralNode(symbolType, temp);
        } else if (ts.isUnionTypeNode(symbolType)) {
            const unionArr:any = [];
            symbolType.types.forEach(type => {
                const unionTemp:any = {};
                if(ts.isTypeLiteralNode(type)){
                    extractLiteralNode(type, unionTemp);
                }else if(ts.isTypeReferenceNode(type)){
                    extractReferencedNode(type, unionTemp);
                }
                unionArr.push(unionTemp);
            })
            temp["unionTypes"] = unionArr;
        }

      }
      Object.assign(params, temp);
    });
  }
};

const extractParameters = (method: ts.FunctionTypeNode, params: any = {}) => {
  method.parameters.map((param) => {
    const paramType = param.type;
    if (!paramType) {
      console.error("Param Type Not Found!");
      return {};
    }

    const tempParam: any = {};
    if (ts.isTypeReferenceNode(paramType)) {
      extractReferencedNode(paramType, tempParam);
    } else if (ts.isTypeLiteralNode(paramType)) {
      extractLiteralNode(paramType, tempParam);
    } else if (ts.isUnionTypeNode(paramType)) {
        const unionArr:any = [];
        paramType.types.forEach(type => {
            const unionTemp:any = {};
            if(ts.isTypeLiteralNode(type)){
                extractLiteralNode(type, unionTemp);
            }else if(ts.isTypeReferenceNode(type)){
                extractReferencedNode(type, unionTemp);
            }
            unionArr.push(unionTemp);
        })
        tempParam["unionTypes"] = unionArr;
    }

    Object.assign(params, tempParam);
  });
};

const extractResponses = (method: ts.FunctionTypeNode, response: any = {}) => {
    const responseType = method.type;
    if(!responseType){
        console.error("Response Not Found");
        return {};
    }

    const tempRes:any = {};
    if (ts.isTypeReferenceNode(responseType)) {
    // for: PaginatedResults & PaginatedResponse
        extractReferencedNode(responseType, tempRes); //need to check if this works or we need a different funtion //
    } else if (ts.isTypeLiteralNode(responseType)) {
        extractLiteralNode(responseType, tempRes);
    } else if (ts.isUnionTypeNode(responseType)) {
        const unionArr:any = [];
            responseType.types.forEach(type => {
                const unionTemp:any = {};
                if(ts.isTypeLiteralNode(type)){
                    extractLiteralNode(type, unionTemp);
                }else if(ts.isTypeReferenceNode(type)){
                    extractReferencedNode(type, unionTemp);
                }
                unionArr.push(unionTemp);
            })
            tempRes["unionTypes"] = unionArr;
    }

    Object.assign(response, tempRes);
};

const extractEndpoints = (node: ts.Node, endpoints: any = {}) => {
  const regex = /.*Endpoints$/;

  if (ts.isTypeAliasDeclaration(node) && regex.test(node.name.text)) {
    const endpointType = node.type as ts.TypeLiteralNode;

    endpointType.members.forEach((member) => {
      if (
        ts.isPropertySignature(member) &&
        member.name &&
        ts.isStringLiteral(member.name)
      ) {
        const apiPath = member.name.text;
        const methodType = member.type as ts.TypeLiteralNode;

        endpoints[apiPath] = {};

        methodType.members.forEach((methodMember) => {
          if (
            ts.isPropertySignature(methodMember) &&
            methodMember.name &&
            ts.isIdentifier(methodMember.name)
          ) {
            const methodName = methodMember.name.text; // GET | POST | DELETE | PUT
            const method = methodMember.type as ts.FunctionTypeNode;

            let params = {};
            extractParameters(method, params);

            let response: any = {};
            extractResponses(method, response);

            endpoints[apiPath][methodName] = {
              params,
              response,
            };
          }
        });
      }
    });
  }

  ts.forEachChild(node, (childNode) => extractEndpoints(childNode, endpoints));
};

function getFormatedFilename(path: string) {
  const parts = path.split("/");
  const filenameWithExtension = parts.pop();

  if (!filenameWithExtension) return console.error("No fileName Found");
  const filename = filenameWithExtension.replace(/\.[^/.]+$/, " Endpoints");

  return filename.toUpperCase();
}

const endpoints: any = {};
program
  .getSourceFiles()
  .filter((file) => !file.isDeclarationFile)
  .map((f) => {
    const filename: string = getFormatedFilename(f.fileName) as string;
    const temp = {};
    extractEndpoints(f, temp);

    if (Object.keys(temp).length) endpoints[filename] = temp;
  });

console.log(JSON.stringify(endpoints));

module.exports = endpoints;

// TODO:
// Add Schemas automatically
// PaginatedResults, Pick<> => in TypeReference of response



/* CUSTOM SCRIPT FOR EXTRACTING AND STORING SCHEMAS */

// const extractSchema = (node: ts.Node) => {
//     const regex = /^I[A-Z]/u;

//     if(ts.isInterfaceDeclaration(node) && regex.test(node.name.text)){
//         console.log(node.name.text);
//     }

//     ts.forEachChild(node, childNode => extractSchema(childNode));
// }
// program.getSourceFiles().filter(file=>file.isDeclarationFile).map(f => {
//     extractSchema(f);
// })
