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
        [ct1: string]: {
          [ct2: string]: null;
        };
      };
    };
  } = yaml.parse(file).CType;

  const posRef = toTSTypeReference("Pos");
  const pd1Ref = t.tsTypeReference(
    t.identifier("PosD1"),
    t.tsTypeParameterInstantiation([toTSTypeReference("P")])
  );
  const ct1Ref = t.tsTypeReference(
    t.identifier("ConjugationType1"),
    t.tsTypeParameterInstantiation([
      toTSTypeReference("P"),
      toTSTypeReference("PD1")
    ])
  );
  const ct2Ref = t.tsTypeReference(
    t.identifier("ConjugationType2"),
    t.tsTypeParameterInstantiation([
      toTSTypeReference("P"),
      toTSTypeReference("PD1"),
      toTSTypeReference("CT1")
    ])
  );

  const ct1Type = (posCheckType: t.TSType, pd1CheckType: t.TSType) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, ct =>
        t.tsUnionType(Object.keys(ct).map(toLiteralType))
      );
    });
  };
  const ct1TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationType1"),
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
      ct1Type(toTSTypeReference("P"), toTSTypeReference("PD1"))
    ),
    []
  );

  const ct2Type = (
    posCheckType: t.TSType,
    pd1CheckType: t.TSType,
    ct1CheckType: t.TSType
  ) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, ct1 => {
        return generateConditionalTypeWithNull(ct1CheckType, 0, ct1, ct2 =>
          t.tsUnionType(Object.keys(ct2).map(toLiteralType))
        );
      });
    });
  };

  const ct2TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationType2"),
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
          default: ct1Ref,
          constraint: ct1Ref,
          name: "CT1"
        } as t.TSTypeParameter
      ]),
      ct2Type(
        toTSTypeReference("P"),
        toTSTypeReference("PD1"),
        toTSTypeReference("CT1")
      )
    ),
    []
  );

  const ctType = (
    posCheckType: t.TSType,
    pd1CheckType: t.TSType,
    ct1CheckType: t.TSType,
    ct2CheckType: t.TSType
  ) => {
    return generateConditionalTypeWithNull(posCheckType, 0, con, pd1 => {
      return generateConditionalTypeWithNull(pd1CheckType, 0, pd1, ct1 => {
        return generateConditionalTypeWithNull(
          ct1CheckType,
          0,
          ct1,
          (ct2, ct1Name) => {
            return generateConditionalType(
              ct2CheckType,
              0,
              ct2,
              (_, ct2Name) => {
                return toLiteralType(ct1Name + "・" + ct2Name);
              }
            );
          },
          (_, ct1Name) => toLiteralType(ct1Name)
        );
      });
    });
  };

  const ctTypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("ConjugationType"),
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
          default: ct1Ref,
          constraint: ct1Ref,
          name: "CT1"
        } as t.TSTypeParameter,
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: ct2Ref,
          constraint: ct2Ref,
          name: "CT2"
        } as t.TSTypeParameter
      ]),
      ctType(
        toTSTypeReference("P"),
        toTSTypeReference("PD1"),
        toTSTypeReference("CT1"),
        toTSTypeReference("CT2")
      )
    ),
    []
  );

  const toCT1FuncDef = template.statement(
    `export const toCT1 = <P extends Pos, PD1 extends PosD1<P>>(pos: P, d1: PD1, s:string):ConjugationType1<P, PD1>=>{
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
              t.identifier("ConjugationType1"),
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

  const toCT2FuncDef = template.statement(
    `export const toCT2 = <P extends Pos, PD1 extends PosD1<P>, CT1 extends ConjugationType1<P, PD1>>
    (pos: P, d1: PD1, ct1: CT1, s:string):ConjugationType2<P, PD1, CT1>=>{
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
              t.identifier("ConjugationType2"),
              t.tsTypeParameterInstantiation([
                t.tsTypeReference(t.identifier("P")),
                t.tsTypeReference(t.identifier("PD1")),
                t.tsTypeReference(t.identifier("CT1"))
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
                      t.identifier("ct1"),
                      p =>
                        Object.keys(p)
                          .filter(s => p[s] !== null)
                          .map(s => {
                            const { SWITCH, RETURN } = toODef(
                              p[s],
                              t.identifier("s"),
                              p =>
                                Object.keys(p)
                                  .filter(s => !!s)
                                  .map(s => {
                                    return t.switchCase(t.stringLiteral(s), [
                                      t.returnStatement(toAs(t.identifier("s")))
                                    ]);
                                  }),
                              toAs(
                                Object.keys(p[s])[0]
                                  ? t.stringLiteral(Object.keys(p[s])[0])
                                  : t.nullLiteral()
                              )
                            );
                            return toSwitchOrDefault(s, SWITCH, RETURN);
                          }),
                      toAs(t.nullLiteral())
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

  const ctSetTypeDef = template.statement(
    `
export type CTSet<
  P extends Pos=Pos,
  PD1 extends PosD1<P>=PosD1<P>,
  CT1 extends ConjugationType1<P,PD1>=ConjugationType1<P,PD1>,
  CT2 extends ConjugationType2<P,PD1,CT1>=ConjugationType2<P,PD1,CT1>
> = {
  ct1: CT1,
  ct2: CT2
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )({});

  const toCTSetFuncDef = template.statement(
    `
export const toCTSet = <
  P extends Pos,
  PD1 extends PosD1<P>,
  CT1 extends ConjugationType1<P,PD1>=ConjugationType1<P,PD1>,
  CT2 extends ConjugationType2<P,PD1,CT1>=ConjugationType2<P,PD1,CT1>
>(
  pos: P,
  d1: PD1,
  ct1: CT1,
  ct2: CT2
): CTSet<P, PD1, CT1, CT2> => {
  return {
    ct1,
    ct2,
  };
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )();

  return [
    ct1TypeDef,
    ct2TypeDef,
    ctTypeDef,
    toCT1FuncDef,
    toCT2FuncDef,
    ctSetTypeDef,
    toCTSetFuncDef
  ];
};
