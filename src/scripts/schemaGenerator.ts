import * as path from "path";
import * as ts from 'typescript';
import * as fs from 'fs';
import * as TJS from "typescript-json-schema";

const settings: TJS.PartialArgs = {
    required: true,
};

const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
};

const fileName = path.join(__dirname, "./sourcefiles.ts");
const files = [fileName];

const program = TJS.getProgramFromFiles(files, compilerOptions);

const generator = TJS.buildGenerator(program);

const symbols = generator?.getSymbols();
const userSymbols = generator?.getUserSymbols();

console.log(symbols);

