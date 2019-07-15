import * as t from "@babel/types";
import generate from "@babel/generator";
import * as prettier from "prettier";
import * as fs from "fs";
import pos from "./pos";
import cform from "./cform";
import ctype from "./ctype";

const generateFor = (name: string) => {
  const posDefs = pos(name);
  const cfDefs = cform(name);
  const ctDefs = ctype(name);
  const typeDefinitions = t.program([...posDefs, ...cfDefs, ...ctDefs]);

  const stringHexToStr = (str: string) => {
    return str.replace(/\\u([\da-fA-F]{4})/g, (matched, g1) => {
      return String.fromCharCode(parseInt(g1, 16));
    });
  };
  const code = prettier.format(
    stringHexToStr(generate(typeDefinitions, {}).code),
    { parser: "typescript" }
  );

  fs.writeFileSync(`./src/types/${name}/generated.ts`, code);
};

generateFor("ipadic");
