import * as yaml from "yaml";
import * as fs from "fs";
import * as t from "@babel/types";
import template from "@babel/template";
import {
  generateConditionalType,
  toLiteralType,
  toTSTypeReference,
  toODef,
  toSwitchOrDefault
} from "./util";

export default (name: string) => {
  const file = fs.readFileSync(`./type-generator/${name}/con.yml`, "utf8");
  const ctype: {
    [pos: string]: {
      [ct: string]: null;
    };
  } = yaml.parse(file).CForm;

  const posRef = toTSTypeReference("Pos");
  const cfRef = t.tsTypeReference(
    t.identifier("ConjugationForm"),
    t.tsTypeParameterInstantiation([toTSTypeReference("P")])
  );

  const cfType = (posCheckType: t.TSType) => {
    return generateConditionalType(posCheckType, 0, ctype, ct =>
      t.tsUnionType(Object.keys(ct).map(toLiteralType))
    );
  };
  const cfTypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationForm"),
      t.tsTypeParameterDeclaration([
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: posRef,
          constraint: posRef,
          name: "P"
        } as t.TSTypeParameter
      ]),
      cfType(toTSTypeReference("P"))
    ),
    []
  );

  const toAs = s => t.tsAsExpression(s, cfRef);

  const toConjugationFormFuncDef = template.statement(
    `export const toConjugationForm = <P extends Pos>(pos: P, s:string):ConjugationForm<P>=>{
  SWITCH;
  RETURN;
}`,
    {
      plugins: ["typescript"],
      placeholderPattern: false,
      placeholderWhitelist: new Set(["SWITCH", "RETURN"])
    }
  )(
    toODef(
      ctype,
      t.identifier("pos"),
      p =>
        Object.keys(p)
          .filter(s => ctype[s] !== null)
          .map(s => {
            const { SWITCH, RETURN } = toODef(
              p[s],
              t.identifier("s"),
              p => {
                return Object.keys(p).map(s =>
                  t.switchCase(t.stringLiteral(s), [
                    t.returnStatement(toAs(t.identifier("s")))
                  ])
                );
              },
              toAs(t.stringLiteral(Object.keys(p[s])[0]))
            );
            return toSwitchOrDefault(s, SWITCH, RETURN);
          }),
      t.nullLiteral()
    )
  );

  return [cfTypeDef, toConjugationFormFuncDef];
};
