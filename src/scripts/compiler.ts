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
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'RoomsEndpoints') {
        const typeLiteral = node.type as ts.TypeLiteralNode;
        typeLiteral.members.forEach(member => {
            if (ts.isPropertySignature(member) && member.name && ts.isStringLiteral(member.name)) {
                const key = member.name.text;
                const methodType = member.type as ts.TypeLiteralNode;

                endpoints[key] = {};

                methodType.members.forEach(methodMember => {
                    if (ts.isPropertySignature(methodMember) && methodMember.name && ts.isIdentifier(methodMember.name)) {
                        const methodName = methodMember.name.text;
                        const method = methodMember.type as ts.FunctionTypeNode;

                        const params = method.parameters.map(param => param.name.getText());
                        const returnType = method.type?.getText() ?? 'void';

                        endpoints[key][methodName] = {
                            params,
                            returnType
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

console.log(JSON.stringify(endpoints, null, 2));
