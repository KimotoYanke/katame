import * as t from "@babel/types";
export const generateConditionalType = <O extends { [key: string]: any }>(
  checkType: t.TSType,
  index: number,
  pos: { [key: string]: O },
  f: (o: O) => t.TSType
): t.TSConditionalType | t.TSNullKeyword | t.TSType => {
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
  } else if (posTypeName === "*") {
    return t.tsConditionalType(
      checkType,
      t.tsAnyKeyword(),
      f(pd1),
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

export const toLiteralType = (n: string) => t.tsLiteralType(t.stringLiteral(n));

export const toODef = <O extends { [key: string]: any }>(
  pos: O,
  identifier: t.Identifier,
  f: (o: O) => t.SwitchCase[],
  defaultReturn: t.Expression = t.stringLiteral(Object.keys(pos)[0])
) => ({
  SWITCH: t.switchStatement(identifier, f(pos)),
  RETURN: t.returnStatement(defaultReturn)
});

export const toSwitchOrDefault = (
  s: string,
  SWITCH: t.SwitchStatement,
  RETURN: t.ReturnStatement
) => {
  if (s === "*") {
    return t.switchCase(null, [SWITCH, RETURN]);
  }
  return t.switchCase(t.stringLiteral(s), [SWITCH, RETURN]);
};

export const toTSTypeReference = (name: string) =>
  t.tsTypeReference(t.identifier(name));
