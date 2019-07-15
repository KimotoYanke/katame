import * as yaml from "yaml";
import * as fs from "fs";
import * as t from "@babel/types";
import template from "@babel/template";
import {
  generateConditionalType,
  toLiteralType,
  toTSTypeReference,
  toODef,
  toSwitchOrDefault,
  generateConditionalTypeWithNull
} from "./util";
export default (name: string) => {
  const file = fs.readFileSync(`./type-generator/${name}/con.yml`, "utf8");
  const con: {
    [pos: string]: {
      [pd1: string]: {
        [cf: string]: {
          [cf2: string]: null;
        };
      };
    };
  } = yaml.parse(file).CForm;

  const posRef = toTSTypeReference("Pos");
  const pd1Ref = t.tsTypeReference(
    t.identifier("PosD1"),
    t.tsTypeParameterInstantiation([toTSTypeReference("P")])
  );
  const cf1Ref = t.tsTypeReference(
    t.identifier("ConjugationForm1"),
    t.tsTypeParameterInstantiation([
      toTSTypeReference("P"),
      toTSTypeReference("PD1")
    ])
  );
  const cf2Ref = t.tsTypeReference(
    t.identifier("ConjugationForm2"),
    t.tsTypeParameterInstantiation([
      toTSTypeReference("P"),
      toTSTypeReference("PD1"),
      toTSTypeReference("CF1")
    ])
  );

  const cf1Type = (posCheckType: t.TSType, pd1CheckType: t.TSType) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, cf =>
        t.tsUnionType(Object.keys(cf).map(toLiteralType))
      );
    });
  };
  const cf1TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationForm1"),
      t.tsTypeParameterDeclaration([
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: posRef,
          constraint: posRef,
          name: "P"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: pd1Ref,
          constraint: pd1Ref,
          name: "PD1"
        } as t.TSTypeParameter
      ]),
      cf1Type(toTSTypeReference("P"), toTSTypeReference("PD1"))
    ),
    []
  );

  const cf2Type = (
    posCheckType: t.TSType,
    pd1CheckType: t.TSType,
    cf1CheckType: t.TSType
  ) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, cf1 => {
        return generateConditionalTypeWithNull(cf1CheckType, 0, cf1, cf2 =>
          t.tsUnionType(Object.keys(cf2).map(toLiteralType))
        );
      });
    });
  };

  const cf2TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationForm2"),
      t.tsTypeParameterDeclaration([
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: posRef,
          constraint: posRef,
          name: "P"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: pd1Ref,
          constraint: pd1Ref,
          name: "PD1"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: cf1Ref,
          constraint: cf1Ref,
          name: "CF1"
        } as t.TSTypeParameter
      ]),
      cf2Type(
        toTSTypeReference("P"),
        toTSTypeReference("PD1"),
        toTSTypeReference("CF1")
      )
    ),
    []
  );

  const cfType = (
    posCheckType: t.TSType,
    pd1CheckType: t.TSType,
    cf1CheckType: t.TSType,
    cf2CheckType: t.TSType
  ) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, cf1 => {
        return generateConditionalTypeWithNull(
          cf1CheckType,
          0,
          cf1,
          (cf2, cf1Name) => {
            return generateConditionalType(
              cf2CheckType,
              0,
              cf2,
              (_, cf2Name) => {
                return toLiteralType(cf1Name + "・" + cf2Name);
              }
            );
          },
          (_, cf1Name) => toLiteralType(cf1Name)
        );
      });
    });
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
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: pd1Ref,
          constraint: pd1Ref,
          name: "PD1"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: cf1Ref,
          constraint: cf1Ref,
          name: "CF1"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: cf2Ref,
          constraint: cf2Ref,
          name: "CF2"
        } as t.TSTypeParameter
      ]),
      cfType(
        toTSTypeReference("P"),
        toTSTypeReference("PD1"),
        toTSTypeReference("CF1"),
        toTSTypeReference("CF2")
      )
    ),
    []
  );

  const toCF1FuncDef = template.statement(
    `export const toCF1 = <P extends Pos, PD1 extends PosD1<P>>(pos: P, d1: PD1, s:string):ConjugationForm1<P, PD1>=>{
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
      con,
      t.identifier("pos"),
      p => {
        const toAs = s =>
          t.tsAsExpression(
            s,
            t.tsTypeReference(
              t.identifier("ConjugationForm1"),
              t.tsTypeParameterInstantiation([
                t.tsTypeReference(t.identifier("P")),
                t.tsTypeReference(t.identifier("PD1"))
              ])
            )
          );

        return Object.keys(p)
          .filter(s => con[s] !== null)
          .map(s => {
            const { SWITCH, RETURN } = toODef(
              p[s],
              t.identifier("d1"),
              p =>
                Object.keys(p)
                  .filter(s => p[s] !== null)
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
              toAs(t.nullLiteral())
            );
            return toSwitchOrDefault(s, SWITCH, RETURN);
          });
      },
      t.nullLiteral()
    )
  );

  const toCF2FuncDef = template.statement(
    `export const toCF2 = <P extends Pos, PD1 extends PosD1<P>, CF1 extends ConjugationForm1<P, PD1>>
    (pos: P, d1: PD1, cf: CF1, s:string):ConjugationForm2<P, PD1, CF1>=>{
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
      con,
      t.identifier("pos"),
      p => {
        const toAs = s =>
          t.tsAsExpression(
            s,
            t.tsTypeReference(
              t.identifier("ConjugationForm2"),
              t.tsTypeParameterInstantiation([
                t.tsTypeReference(t.identifier("P")),
                t.tsTypeReference(t.identifier("PD1")),
                t.tsTypeReference(t.identifier("CF1"))
              ])
            )
          );

        return Object.keys(p)
          .filter(s => con[s] !== null)
          .map(s => {
            const { SWITCH, RETURN } = toODef(
              p[s],
              t.identifier("d1"),
              p =>
                Object.keys(p)
                  .filter(s => p[s] !== null)
                  .map(s => {
                    const { SWITCH, RETURN } = toODef(
                      p[s],
                      t.identifier("cf"),
                      p =>
                        Object.keys(p)
                          .filter(s => p[s] !== null)
                          .map(s => {
                            const { SWITCH, RETURN } = toODef(
                              p[s],
                              t.identifier("cf"),
                              p =>
                                Object.keys(p).map(s => {
                                  return t.switchCase(t.stringLiteral(s), [
                                    t.returnStatement(toAs(t.identifier("s")))
                                  ]);
                                }),
                              toAs(t.nullLiteral())
                            );
                            return toSwitchOrDefault(s, SWITCH, RETURN);
                          }),
                      toAs(t.stringLiteral(Object.keys(p[s])[0]))
                    );
                    return toSwitchOrDefault(s, SWITCH, RETURN);
                  }),
              toAs(t.nullLiteral())
            );
            return toSwitchOrDefault(s, SWITCH, RETURN);
          });
      },
      t.nullLiteral()
    )
  );

  const cfSetTypeDef = template.statement(
    `
export type CFSet<
  P extends Pos=Pos,
  PD1 extends PosD1<P>=PosD1<P>,
  CF1 extends ConjugationForm1<P,PD1>=ConjugationForm1<P,PD1>,
  CF2 extends ConjugationForm2<P,PD1,CF1>=ConjugationForm2<P,PD1,CF1>
> = {
  cf1: CF1,
  cf2: CF2
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )({});

  const toCFSetFuncDef = template.statement(
    `
export const toCFSet = <
  P extends Pos,
  PD1 extends PosD1<P>,
  CF1 extends ConjugationForm1<P,PD1>=ConjugationForm1<P,PD1>,
  CF2 extends ConjugationForm2<P,PD1,CF1>=ConjugationForm2<P,PD1,CF1>
>(
  pos: P,
  d1: PD1,
  cf1: CF1,
  cf2: CF2
): CFSet<P, PD1, CF1, CF2> => {
  return {
    cf1,
    cf2,
  };
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )();

  return [
    cf1TypeDef,
    cf2TypeDef,
    cfTypeDef,
    toCF1FuncDef,
    toCF2FuncDef,
    cfSetTypeDef,
    toCFSetFuncDef
  ];
};
