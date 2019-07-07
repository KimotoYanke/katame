import * as yaml from "yaml";
import * as fs from "fs";
import * as t from "@babel/types";
import generate from "@babel/generator";
import template from "@babel/template";
const file = fs.readFileSync("./definitions/pos.yml", "utf8");

const pos: {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: null;
      } | null;
    } | null;
  };
} = yaml.parse(file).POS;

const toLiteralType = (n: string) => t.tsLiteralType(t.stringLiteral(n));

const posType = t.tsUnionType(
  Object.keys(pos).map(posTypeName => toLiteralType(posTypeName))
);

const posTypeDef = t.tsTypeAliasDeclaration(
  t.identifier("Pos"),
  undefined,
  posType
);

const generateConditionalType = <O extends { [key: string]: any }>(
  checkType: t.TSType,
  index: number,
  pos: { [key: string]: O },
  f: (o: O) => t.TSType
): t.TSConditionalType | t.TSNullKeyword => {
  const keys = Object.keys(pos);
  const posTypeName = keys[index];
  if (posTypeName === undefined) {
    return t.tsNullKeyword();
  }
  const pd1 = pos[posTypeName];
  if (pd1 === null) {
    return t.tsConditionalType(
      checkType,
      toLiteralType(posTypeName),
      t.tsNullKeyword(),
      generateConditionalType(checkType, index + 1, pos, f)
    );
  }
  return t.tsConditionalType(
    checkType,
    toLiteralType(posTypeName),
    f(pd1),
    generateConditionalType(checkType, index + 1, pos, f)
  );
};

const pd1Type = (checkType: t.TSType) => {
  return generateConditionalType(checkType, 0, pos, pd1 =>
    t.tsUnionType(Object.keys(pd1).map(toLiteralType))
  );
};

const pd1TypeDef = t.tsTypeAliasDeclaration(
  t.identifier("PosD1"),
  t.tsTypeParameterDeclaration([
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("Pos")),
      constraint: t.tsTypeReference(t.identifier("Pos")),
      name: "P"
    } as t.TSTypeParameter
  ]),
  pd1Type(t.tsTypeReference(t.identifier("P")))
);

const pd2Type = (posCheckType: t.TSType, pd1CheckType: t.TSType) => {
  return generateConditionalType(posCheckType, 0, pos, pd1 => {
    return generateConditionalType(pd1CheckType, 0, pd1, pd2 =>
      t.tsUnionType(Object.keys(pd2).map(toLiteralType))
    );
  });
};

const pd2TypeDef = t.tsTypeAliasDeclaration(
  t.identifier("PosD2"),
  t.tsTypeParameterDeclaration([
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("Pos")),
      constraint: t.tsTypeReference(t.identifier("Pos")),
      name: "P"
    } as t.TSTypeParameter,
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("PosD1")),
      constraint: t.tsTypeReference(t.identifier("PosD1")),
      name: "PD1"
    } as t.TSTypeParameter
  ]),
  pd2Type(
    t.tsTypeReference(t.identifier("P")),
    t.tsTypeReference(t.identifier("PD1"))
  )
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

const pd3TypeDef = t.tsTypeAliasDeclaration(
  t.identifier("PosD3"),
  t.tsTypeParameterDeclaration([
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("Pos")),
      constraint: t.tsTypeReference(t.identifier("Pos")),
      name: "P"
    } as t.TSTypeParameter,
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("PosD1")),
      constraint: t.tsTypeReference(t.identifier("PosD1")),
      name: "PD1"
    } as t.TSTypeParameter,
    {
      type: "TSTypeParameter" as "TSTypeParameter",
      default: t.tsTypeReference(t.identifier("PosD2")),
      constraint: t.tsTypeReference(t.identifier("PosD2")),
      name: "PD2"
    } as t.TSTypeParameter
  ]),
  pd3Type(
    t.tsTypeReference(t.identifier("P")),
    t.tsTypeReference(t.identifier("PD1")),
    t.tsTypeReference(t.identifier("PD2"))
  )
);

const toODef = <O extends { [key: string]: any }>(
  pos: O,
  identifier: t.Identifier,
  f: (o: O) => t.SwitchCase[],
  defaultReturn: t.Expression = t.stringLiteral(Object.keys(pos)[0])
) => ({
  SWITCH: t.switchStatement(identifier, f(pos)),
  RETURN: t.returnStatement(defaultReturn)
});

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
          return t.switchCase(t.stringLiteral(s), [SWITCH, RETURN]);
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
                              Object.keys(p)
                                .filter(s => p[s] !== null)
                                .map(s => {
                                  const { SWITCH, RETURN } = toODef(
                                    p[s],
                                    t.identifier("s"),
                                    p =>
                                      Object.keys(p).map(s =>
                                        t.switchCase(t.stringLiteral(s), [
                                          t.returnStatement(
                                            toAs(t.identifier("s"))
                                          )
                                        ])
                                      ),
                                    toAs(t.stringLiteral(Object.keys(p[s])[0]))
                                  );
                                  return t.switchCase(t.stringLiteral(s), [
                                    SWITCH,
                                    RETURN
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
  P extends Pos,
  PD1 extends PosD1<P>,
  PD2 extends PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2>
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

const typeDefinitions = t.program([
  posTypeDef,
  pd1TypeDef,
  pd2TypeDef,
  pd3TypeDef,
  posDetailTypeDef,
  toPosDetailFuncDef,
  toPosFuncDef,
  toP1FuncDef,
  toP2FuncDef
]);

const stringHexToStr = (str: string) => {
  return str.replace(/\\u([\da-fA-F]{4})/g, (matched, g1) => {
    return String.fromCharCode(parseInt(g1, 16));
  });
};
const code = stringHexToStr(generate(typeDefinitions, {}).code);

fs.writeFileSync("./src/mecab/types/generated/pos.ts", code);
