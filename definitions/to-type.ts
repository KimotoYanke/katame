import * as t from "@babel/types";
import generate from "@babel/generator";
import * as fs from "fs";
import pos from "./pos";
import con from "./con";

const typeDefinitions = t.program([...pos, ...con]);

const stringHexToStr = (str: string) => {
  return str.replace(/\\u([\da-fA-F]{4})/g, (matched, g1) => {
    return String.fromCharCode(parseInt(g1, 16));
  });
};
const code = stringHexToStr(generate(typeDefinitions, {}).code);

fs.writeFileSync("./src/mecab/types/generated/type.ts", code);
