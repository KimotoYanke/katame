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

type PosD1<P extends Pos> = P extends never
  ? null
  : P extends "連体詞"
  ? null
  : P extends "接頭詞"
  ? "形容詞接続" | "数接続" | "動詞接続" | "名詞接続"
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

type PosD2<P extends Pos, PD1 extends PosD1<P>> = P extends never
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

type PosD3<
  P extends Pos,
  PD1 extends PosD1<P>,
  PD2 extends PosD2<P, PD1>
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

type PosDetail<
  P extends Pos = any,
  PD1 extends PosD1<P> = any,
  PD2 extends PosD2<P, PD1> = any,
  PD3 extends PosD3<P, PD1, PD2> = any
> = {
  pos: P;
  detail1: PD1;
  detail2: PD2;
  detail3: PD3;
};

interface ParsedResult<PD extends PosDetail> {
  surface: string;
  posDetail: PD;
  conjugationForm: string;
  conjugationType: string;
  basic: string;
  reading: string;
  pronunciation: string;
}
