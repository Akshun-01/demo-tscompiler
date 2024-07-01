import * as path from "path";
import * as ts from 'typescript';

const fileName = path.join(__dirname, '../scripts/sourcefiles.ts');
const fileContent = ts.sys.readFile(fileName);

if (!fileContent) {
    console.error(`Could not read file: ${fileName}`);
    process.exit(1);
}

const sourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true);
const program = ts.createProgram([fileName], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS
});
const checker = program.getTypeChecker();
const processedTypes = new Map<string, any>();

const getTypeProperties = (typeNode: ts.TypeNode): Record<string, string> => {
    const properties: Record<string, string> = {};
    
    if (ts.isTypeLiteralNode(typeNode)) {
        typeNode.members.forEach(member => {
            if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
                const key = member.name.text;
                const type = checker.getTypeAtLocation(member.type!);
                properties[key] = checker.typeToString(type);
            }
        });
    } else if (ts.isTypeReferenceNode(typeNode)) {
        typeNode.typeArguments?.forEach(arg => {
            if (ts.isTypeLiteralNode(arg)) {
                Object.assign(properties, getTypeProperties(arg));
            }
        });
    }

    return properties;
};

const extractReferencedNode = (typeNode: ts.Identifier): Record<string, string> => {
    const symbol = checker.getSymbolAtLocation(typeNode);
    if (!symbol) return { [typeNode.getText()]: '' };

    const alias = symbol.declarations?.find(ts.isTypeAliasDeclaration);
    if (alias && ts.isTypeAliasDeclaration(alias) && alias.type) {
        return getTypeProperties(alias.type);
    }

    return { [typeNode.getText()]: '' };
};

const extractEndpoints = (node: ts.Node, endpoints: Record<string, any> = {}) => {
    const regex = /.*Endpoints$/;

    if (ts.isTypeAliasDeclaration(node) && regex.test(node.name.text)) {
        const typeLiteral = node.type as ts.TypeLiteralNode;

        typeLiteral.members.forEach(member => {
            if (ts.isPropertySignature(member) && ts.isStringLiteral(member.name)) {
                const key = member.name.text;
                const methodType = member.type as ts.TypeLiteralNode;

                endpoints[key] = {};

                methodType.members.forEach(methodMember => {
                    if (ts.isPropertySignature(methodMember) && ts.isIdentifier(methodMember.name)) {
                        const methodName = methodMember.name.text;
                        const method = methodMember.type as ts.FunctionTypeNode;

                        const params = method.parameters.reduce<Record<string, string>>((acc, param) => {
                            if (ts.isTypeReferenceNode(param.type!)) {
                                const paramTypeName = param.type.typeName as ts.Identifier;
                                Object.assign(acc, extractReferencedNode(paramTypeName));
                            } else if (ts.isTypeLiteralNode(param.type!)) {
                                Object.assign(acc, getTypeProperties(param.type));
                            }
                            return acc;
                        }, {});

                        const response = ts.isUnionTypeNode(method.type)
                            ? method.type.types.map(type => {
                                if (ts.isTypeLiteralNode(type)) {
                                    return getTypeProperties(type);
                                } else {
                                    return checker.typeToString(checker.getTypeAtLocation(type));
                                }
                            })
                            : getTypeProperties(method.type as ts.TypeLiteralNode);

                        endpoints[key][methodName] = { params, response };
                    }
                });
            }
        });
    }

    ts.forEachChild(node, childNode => extractEndpoints(childNode, endpoints));
};

const getFormattedFilename = (filePath: string): string => {
    const parts = filePath.split('/');
    const filenameWithExtension = parts.pop();
    if (!filenameWithExtension) {
        throw new Error("No fileName Found");
    }
    return filenameWithExtension.replace(/\.[^/.]+$/, "Endpoints");
};

const endpoints: Record<string, any> = {};
program.getSourceFiles()
    .filter(file => !file.isDeclarationFile)
    .forEach(file => {
        const filename = getFormattedFilename(file.fileName);
        const temp: Record<string, any> = {};
        extractEndpoints(file, temp);
        if (Object.keys(temp).length > 0) {
            endpoints[filename] = temp;
        }
    });

console.log(JSON.stringify(endpoints));

module.exports = endpoints;
