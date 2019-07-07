type Pos =
  | "連体詞"
  | "接頭詞"
  | "名詞"
  | "動詞"
  | "形容詞"
  | "副詞"
  | "接続詞"
  | "助詞"
  | "助動詞"
  | "感動詞"
  | "記号"
  | "フィラー"
  | "その他"
  | "未知語";

const isPos = <P extends Pos = Pos>(str: string): str is P => {
  switch (str) {
    case "連体詞":
    case "接頭詞":
    case "名詞":
    case "動詞":
    case "形容詞":
    case "副詞":
    case "接続詞":
    case "助詞":
    case "助動詞":
    case "感動詞":
    case "記号":
    case "フィラー":
    case "その他":
    case "未知語":
      return true;
  }

  return false;
};

type PosD1<P extends Pos> = P extends never
  ? null
  : P extends "連体詞"
  ? null
  : P extends "接頭詞"
  ? "形容詞接続" | "数接続" | "動詞接続" | "名詞接続" | null
  : P extends "名詞"
  ?
      | "引用文字列"
      | "サ変接続"
      | "ナイ形容詞語幹"
      | "形容動詞語幹"
      | "動詞非自立的"
      | "副詞可能"
      | "一般"
      | "数"
      | "接続詞的"
      | "固有名詞"
      | "接尾"
      | "代名詞"
      | "非自立"
      | "特殊"
  : P extends "動詞"
  ? "自立" | "接尾" | "非自立"
  : P extends "形容詞"
  ? "自立" | "接尾" | "非自立"
  : P extends "副詞"
  ? "一般" | "助詞類接続"
  : P extends "助詞"
  ?
      | "格助詞"
      | "係助詞"
      | "終助詞"
      | "接続助詞"
      | "特殊"
      | "副詞化"
      | "副助詞"
      | "副助詞／並立助詞／終助詞"
      | "並立助詞"
      | "連体化"
  : P extends "記号"
  ? "句点" | "読点" | "空白" | "アルファベット" | "一般" | "括弧開" | "括弧閉"
  : null;

const isPosD1 = <P extends Pos = Pos>(
  pos: P,
  detail1: string | null
): detail1 is PosD1<P> => {
  switch (pos) {
    case "接頭詞":
      switch (detail1) {
        case "数接続":
        case "形容詞接続":
        case "動詞接続":
        case "名詞接続":
        case null:
          return true;
      }
      break;
    case "名詞":
      switch (detail1) {
        case "引用文字列":
        case "サ変接続":
        case "ナイ形容詞語幹":
        case "形容動詞語幹":
        case "動詞非自立的":
        case "副詞可能":
        case "一般":
        case "数":
        case "接続詞的":
        case "固有名詞":
        case "接尾":
        case "代名詞":
        case "非自立":
        case "特殊":
          return true;
      }
      break;
    case "動詞":
      switch (detail1) {
        case "自立":
        case "接尾":
        case "非自立":
          return true;
      }
      break;
    case "形容詞":
      switch (detail1) {
        case "自立":
        case "接尾":
        case "非自立":
          return true;
      }
      break;
    case "副詞":
      switch (detail1) {
        case "一般":
        case "助詞類接続":
          return true;
      }
      break;
    case "助詞":
      switch (detail1) {
        case "格助詞":
        case "係助詞":
        case "終助詞":
        case "接続助詞":
        case "特殊":
        case "副詞化":
        case "副助詞":
        case "副助詞／並立助詞／終助詞":
        case "並立助詞":
        case "連体化":
          return true;
      }
      break;
    case "記号":
      switch (detail1) {
        case "句点":
        case "読点":
        case "空白":
        case "アルファベット":
        case "一般":
        case "括弧開":
        case "括弧閉":
          return true;
      }
      break;
  }
  return detail1 === null;
};

type PosD2<P extends Pos, PD1 extends PosD1<P> = PosD1<P>> = P extends never
  ? null
  : P extends "名詞"
  ? PD1 extends "固有名詞"
    ? "一般" | "人名" | "組織" | "地域"
    : PD1 extends "接尾"
    ?
        | "サ変接続"
        | "一般"
        | "形容動詞語幹"
        | "助数詞"
        | "助動詞語幹"
        | "人名"
        | "地域"
        | "特殊"
        | "副詞可能"
    : PD1 extends "代名詞"
    ? "一般" | "縮約"
    : PD1 extends "非自立"
    ? "一般" | "形容動詞語幹" | "助動詞語幹" | "副詞可能"
    : PD1 extends "特殊"
    ? "助動詞語幹"
    : null
  : P extends "助詞"
  ? PD1 extends "格助詞"
    ? "一般" | "引用" | "連語"
    : null
  : null;

const isPosD2 = <
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P>
>(
  pos: P,
  detail1: PD1,
  detail2: string | null
): detail2 is PD2 => {
  switch (pos) {
    case "名詞":
      switch (detail1) {
        case "固有名詞":
          switch (detail2) {
            case "一般":
            case "人名":
            case "組織":
            case "地域":
              return true;
          }
          break;
        case "接尾":
          switch (detail2) {
            case "サ変接続":
            case "一般":
            case "形容動詞語幹":
            case "助数詞":
            case "助動詞語幹":
            case "人名":
            case "地域":
            case "特殊":
            case "副詞可能":
              return true;
          }
          break;
        case "代名詞":
          switch (detail2) {
            case "一般":
            case "縮約":
              return true;
          }
          break;
        case "非自立":
          switch (detail2) {
            case "一般":
            case "形容動詞語幹":
            case "助動詞語幹":
            case "副詞可能":
              return true;
          }
          break;
        case "特殊":
          return detail2 === "助動詞語幹";
      }
      break;
    case "助詞":
      switch (detail1) {
        case "格助詞":
          switch (detail2) {
            case "一般":
            case "引用":
            case "連語":
              return true;
          }
          break;
      }
      break;
  }
  return detail1 === null;
};

type PosD3<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>
> = P extends never
  ? null
  : P extends "名詞"
  ? PD1 extends "固有名詞"
    ? PD2 extends "人名"
      ? "一般" | "姓" | "名"
      : PD2 extends "地域"
      ? "一般" | "国"
      : null
    : null
  : null;

const isPosD3 = <
  P extends Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2> = PosD3<P, PD1, PD2>
>(
  pos: P,
  detail1: PD1,
  detail2: PD2,
  detail3: string | null
): detail3 is PD3 => {
  if (pos === "名詞" && detail1 === "固有名詞") {
    if (detail2 === "人名") {
      switch (detail3) {
        case "一般":
        case "姓":
        case "名":
          return true;
      }
    } else if (detail2 === "地域") {
      switch (detail3) {
        case "一般":
        case "国":
          return true;
      }
    }
  }
  return detail3 === null;
};

export type PosDetail<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2> = PosD3<P, PD1, PD2>
> = {
  pos: P;
  detail1: PD1;
  detail2: PD2;
  detail3: PD3;
};

export const toPosDetail = (
  pos: string,
  detail1: string | null,
  detail2: string | null,
  detail3: string | null
): PosDetail => {
  const nPos: Pos = isPos(pos) ? pos : "未知語";
  const nD1: PosD1<Pos> = isPosD1(nPos, detail1) ? detail1 : null;
  const nD2: PosD2<Pos> = isPosD2(nPos, nD1, detail2) ? detail2 : null;
  const nD3: PosD3<Pos> = isPosD3(nPos, nD1, nD2, detail3) ? detail3 : null;
  return {
    pos: nPos,
    detail1: nD1,
    detail2: nD2,
    detail3: nD3
  };
};
