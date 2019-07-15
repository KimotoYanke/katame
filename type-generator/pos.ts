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
  const file = fs.readFileSync(`./type-generator/${name}/pos.yml`, "utf8");

  const pos: {
    // 名詞
    [pos: string]: {
      // 固有名詞
      [pd1: string]: {
        // 人名
        [pd2: string]: {
          // 姓
          [pd3: string]: null;
        } | null;
      } | null;
    };
  } = yaml.parse(file).POS;

  const posRef = toTSTypeReference("Pos");
  const pd1Ref = t.tsTypeReference(
    t.identifier("PosD1"),
    t.tsTypeParameterInstantiation([toTSTypeReference("P")])
  );
  const pd2Ref = t.tsTypeReference(
    t.identifier("PosD2"),
    t.tsTypeParameterInstantiation([
      toTSTypeReference("P"),
      toTSTypeReference("PD1")
    ])
  );

  const posType = t.tsUnionType(
    Object.keys(pos).map(posTypeName => toLiteralType(posTypeName))
  );

  const posTypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(t.identifier("Pos"), undefined, posType),
    []
  );

  const pd1Type = (checkType: t.TSType) => {
    return generateConditionalType(checkType, 0, pos, pd1 =>
      t.tsUnionType(Object.keys(pd1).map(toLiteralType))
    );
  };

  const pd1TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("PosD1"),
      t.tsTypeParameterDeclaration([
        {
          type: "TSTypeParameter" as "TSTypeParameter",
          default: posRef,
          constraint: posRef,
          name: "P"
        } as t.TSTypeParameter
      ]),
      pd1Type(toTSTypeReference("P"))
    ),
    []
  );

  const pd2Type = (posCheckType: t.TSType, pd1CheckType: t.TSType) => {
    return generateConditionalType(posCheckType, 0, pos, pd1 => {
      return generateConditionalType(pd1CheckType, 0, pd1, pd2 =>
        t.tsUnionType(Object.keys(pd2).map(toLiteralType))
      );
    });
  };

  const pd2TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("PosD2"),
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
      pd2Type(toTSTypeReference("P"), toTSTypeReference("PD1"))
    ),
    []
  );

  const pd3Type = (
    posCheckType: t.TSType,
    pd1CheckType: t.TSType,
    pd2CheckType: t.TSType
  ) => {
    return generateConditionalType(posCheckType, 0, pos, pd1 =>
      generateConditionalType(pd1CheckType, 0, pd1, pd2 =>
        generateConditionalType(pd2CheckType, 0, pd2, pd3 =>
          t.tsUnionType(Object.keys(pd3).map(toLiteralType))
        )
      )
    );
  };

  const pd3TypeDef = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier("PosD3"),
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
          default: pd2Ref,
          constraint: pd2Ref,
          name: "PD2"
        } as t.TSTypeParameter
      ]),
      pd3Type(
        toTSTypeReference("P"),
        toTSTypeReference("PD1"),
        toTSTypeReference("PD2")
      )
    ),
    []
  );

  const toPosFuncDef = template.statement(
    `export const toPos = (s:string):Pos=>{
  SWITCH;
  RETURN;
}`,
    { plugins: ["typescript"] }
  )(
    toODef(pos, t.identifier("s"), _ =>
      Object.keys(pos).map(s =>
        t.switchCase(t.stringLiteral(s), [t.returnStatement(t.identifier("s"))])
      )
    )
  );

  const toP1FuncDef = template.statement(
    `export const toPosD1 = <P extends Pos>(pos: P, s:string):PosD1=>{
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
      pos,
      t.identifier("pos"),
      p =>
        Object.keys(p)
          .filter(s => pos[s] !== null)
          .map(s => {
            const { SWITCH, RETURN } = toODef(p[s], t.identifier("s"), p => {
              return Object.keys(p).map(s =>
                t.switchCase(t.stringLiteral(s), [
                  t.returnStatement(t.identifier("s"))
                ])
              );
            });
            return toSwitchOrDefault(s, SWITCH, RETURN);
          }),
      t.nullLiteral()
    )
  );

  const toP2FuncDef = template.statement(
    `export const toPosD2 = <P extends Pos, PD1 extends PosD1<P>>(pos: P, d1: PD1, s:string):PosD2<P, PD1>=>{
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
      pos,
      t.identifier("pos"),
      p => {
        const toAs = s =>
          t.tsAsExpression(
            s,
            t.tsTypeReference(
              t.identifier("PosD2"),
              t.tsTypeParameterInstantiation([
                t.tsTypeReference(t.identifier("P")),
                t.tsTypeReference(t.identifier("PD1"))
              ])
            )
          );

        return Object.keys(p)
          .filter(s => pos[s] !== null)
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

  const toP3FuncDef = template.statement(
    `export const toPosD3 = <P extends Pos, PD1 extends PosD1<P>, PD2 extends PosD2<P, PD1>>
    (pos: P, d1: PD1, d2: PD2, s:string):PosD3<P, PD1, PD2>=>{
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
      pos,
      t.identifier("pos"),
      p => {
        const toAs = s =>
          t.tsAsExpression(
            s,
            t.tsTypeReference(
              t.identifier("PosD3"),
              t.tsTypeParameterInstantiation([
                t.tsTypeReference(t.identifier("P")),
                t.tsTypeReference(t.identifier("PD1")),
                t.tsTypeReference(t.identifier("PD2"))
              ])
            )
          );

        return Object.keys(p)
          .filter(s => pos[s] !== null)
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
                      t.identifier("d2"),
                      p =>
                        Object.keys(p)
                          .filter(s => p[s] !== null)
                          .map(s => {
                            const { SWITCH, RETURN } = toODef(
                              p[s],
                              t.identifier("d2"),
                              p =>
                                Object.keys(p).map(s => {
                                  return t.switchCase(t.stringLiteral(s), [
                                    t.returnStatement(toAs(t.identifier("s")))
                                  ]);
                                }),
                              toAs(t.nullLiteral())
                            );
                            return t.switchCase(t.stringLiteral(s), [
                              SWITCH,
                              RETURN
                            ]);
                          }),
                      toAs(t.stringLiteral(Object.keys(p[s])[0]))
                    );
                    return t.switchCase(t.stringLiteral(s), [SWITCH, RETURN]);
                  }),
              toAs(t.nullLiteral())
            );
            return t.switchCase(t.stringLiteral(s), [SWITCH, RETURN]);
          });
      },
      t.nullLiteral()
    )
  );

  const posDetailTypeDef = template.statement(
    `
export type PosDetail<
  P extends Pos=Pos,
  PD1 extends PosD1<P>=PosD1<P>,
  PD2 extends PosD2<P, PD1>=PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2>=PosD3<P, PD1, PD2>
> = {
  pos: P;
  d1: PD1;
  d2: PD2;
  d3: PD3;
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )({});

  const toPosDetailFuncDef = template.statement(
    `
export const toPosDetail = <
  P extends Pos,
  PD1 extends PosD1<P>,
  PD2 extends PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2>
>(
  pos: P,
  d1: PD1,
  d2: PD2,
  d3: PD3
): PosDetail<P, PD1, PD2, PD3> => {
  return {
    pos,
    d1,
    d2,
    d3
  };
};
`,
    {
      plugins: ["typescript"],
      placeholderPattern: false
    }
  )();

  return [
    posTypeDef,
    pd1TypeDef,
    pd2TypeDef,
    pd3TypeDef,
    posDetailTypeDef,
    toPosDetailFuncDef,
    toPosFuncDef,
    toP1FuncDef,
    toP2FuncDef,
    toP3FuncDef
  ];
};
