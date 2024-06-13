import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
// const fs = require("fs");
// const path = require("path");
// const ts = require("typescript");

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

console.log(files);

