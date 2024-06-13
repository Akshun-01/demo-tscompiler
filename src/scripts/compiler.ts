import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";

function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== "undefined";
}

//create program
const program = ts.createProgram({
  options: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ESNext,
  },
  rootNames: [
    //path to ../types/room.ts
    path.join(__dirname, "../types/room.ts"),
  ],
});

// get files
let files = program
  .getSourceFiles()
  .filter((sf) => !sf.isDeclarationFile);

files = [...files].filter( f => f.fileName.includes("types"));

files.map(file => {
  console.log(file);
})

// get checker and symbol
const checker = program.getTypeChecker();

const sfSymbols = files
  .map(f => checker.getSymbolAtLocation(f))
  .filter(isDefined);
  

// for each source file symbol
sfSymbols.forEach(sfSymbol => {
  // console.log(sfSymbol);
  
  // sfSymbol.exports?.forEach(ex => {
  //   if(ex.escapedName==="RoomsEndpoints"){
  //     console.log(ex.declarations[0].type);
  //   }
  // });
  
})

