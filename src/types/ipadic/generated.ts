export type Pos =
  | "未知語"
  | "名詞"
  | "接頭詞"
  | "動詞"
  | "形容詞"
  | "副詞"
  | "連体詞"
  | "接続詞"
  | "助詞"
  | "助動詞"
  | "感動詞"
  | "記号"
  | "フィラー"
  | "その他";
export type PosD1<P extends Pos = Pos> = P extends "未知語"
  ? null
  : P extends "名詞"
  ?
      | "一般"
      | "固有名詞"
      | "代名詞"
      | "副詞可能"
      | "サ変接続"
      | "形容動詞語幹"
      | "ナイ形容詞語幹"
      | "数"
      | "非自立"
      | "特殊"
      | "接尾"
      | "接続詞的"
      | "動詞非自立的"
  : P extends "接頭詞"
  ? "名詞接続" | "数接続" | "動詞接続" | "形容詞接続"
  : P extends "動詞"
  ? "自立" | "非自立" | "接尾"
  : P extends "形容詞"
  ? "自立" | "非自立" | "接尾"
  : P extends "副詞"
  ? "一般" | "助詞類接続"
  : P extends "連体詞"
  ? null
  : P extends "接続詞"
  ? null
  : P extends "助詞"
  ?
      | "格助詞"
      | "接続助詞"
      | "係助詞"
      | "副助詞"
      | "並立助詞"
      | "終助詞"
      | "副助詞／並立助詞／終助詞"
      | "連体化"
      | "副詞化"
      | "特殊"
      | "間投助詞"
  : P extends "助動詞"
  ? null
  : P extends "感動詞"
  ? null
  : P extends "記号"
  ? "一般" | "アルファベット" | "句点" | "読点" | "空白" | "括弧開" | "括弧閉"
  : P extends "フィラー"
  ? null
  : P extends "その他"
  ? "間投"
  : null;
export type PosD2<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>
> = P extends "未知語"
  ? null
  : P extends "名詞"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "固有名詞"
    ? "一般" | "人名" | "組織" | "地域"
    : PD1 extends "代名詞"
    ? "一般" | "縮約"
    : PD1 extends "副詞可能"
    ? null
    : PD1 extends "サ変接続"
    ? null
    : PD1 extends "形容動詞語幹"
    ? null
    : PD1 extends "ナイ形容詞語幹"
    ? null
    : PD1 extends "数"
    ? null
    : PD1 extends "非自立"
    ? "一般" | "副詞可能" | "助動詞語幹" | "形容動詞語幹"
    : PD1 extends "特殊"
    ? "助動詞語幹"
    : PD1 extends "接尾"
    ?
        | "一般"
        | "人名"
        | "地域"
        | "サ変接続"
        | "助動詞語幹"
        | "形容動詞語幹"
        | "副詞可能"
        | "助数詞"
        | "特殊"
    : PD1 extends "接続詞的"
    ? null
    : PD1 extends "動詞非自立的"
    ? null
    : null
  : P extends "接頭詞"
  ? PD1 extends "名詞接続"
    ? null
    : PD1 extends "数接続"
    ? null
    : PD1 extends "動詞接続"
    ? null
    : PD1 extends "形容詞接続"
    ? null
    : null
  : P extends "動詞"
  ? PD1 extends "自立"
    ? null
    : PD1 extends "非自立"
    ? null
    : PD1 extends "接尾"
    ? null
    : null
  : P extends "形容詞"
  ? PD1 extends "自立"
    ? null
    : PD1 extends "非自立"
    ? null
    : PD1 extends "接尾"
    ? null
    : null
  : P extends "副詞"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "助詞類接続"
    ? null
    : null
  : P extends "連体詞"
  ? null
  : P extends "接続詞"
  ? null
  : P extends "助詞"
  ? PD1 extends "格助詞"
    ? "一般" | "引用" | "連語"
    : PD1 extends "接続助詞"
    ? null
    : PD1 extends "係助詞"
    ? null
    : PD1 extends "副助詞"
    ? null
    : PD1 extends "並立助詞"
    ? null
    : PD1 extends "終助詞"
    ? null
    : PD1 extends "副助詞／並立助詞／終助詞"
    ? null
    : PD1 extends "連体化"
    ? null
    : PD1 extends "副詞化"
    ? null
    : PD1 extends "特殊"
    ? null
    : PD1 extends "間投助詞"
    ? null
    : null
  : P extends "助動詞"
  ? null
  : P extends "感動詞"
  ? null
  : P extends "記号"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "アルファベット"
    ? null
    : PD1 extends "句点"
    ? null
    : PD1 extends "読点"
    ? null
    : PD1 extends "空白"
    ? null
    : PD1 extends "括弧開"
    ? null
    : PD1 extends "括弧閉"
    ? null
    : null
  : P extends "フィラー"
  ? null
  : P extends "その他"
  ? PD1 extends "間投"
    ? null
    : null
  : null;
export type PosD3<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>
> = P extends "未知語"
  ? null
  : P extends "名詞"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "固有名詞"
    ? PD2 extends "一般"
      ? null
      : PD2 extends "人名"
      ? "一般" | "姓" | "名"
      : PD2 extends "組織"
      ? null
      : PD2 extends "地域"
      ? "一般" | "国"
      : null
    : PD1 extends "代名詞"
    ? PD2 extends "一般"
      ? null
      : PD2 extends "縮約"
      ? null
      : null
    : PD1 extends "副詞可能"
    ? null
    : PD1 extends "サ変接続"
    ? null
    : PD1 extends "形容動詞語幹"
    ? null
    : PD1 extends "ナイ形容詞語幹"
    ? null
    : PD1 extends "数"
    ? null
    : PD1 extends "非自立"
    ? PD2 extends "一般"
      ? null
      : PD2 extends "副詞可能"
      ? null
      : PD2 extends "助動詞語幹"
      ? null
      : PD2 extends "形容動詞語幹"
      ? null
      : null
    : PD1 extends "特殊"
    ? PD2 extends "助動詞語幹"
      ? null
      : null
    : PD1 extends "接尾"
    ? PD2 extends "一般"
      ? null
      : PD2 extends "人名"
      ? null
      : PD2 extends "地域"
      ? null
      : PD2 extends "サ変接続"
      ? null
      : PD2 extends "助動詞語幹"
      ? null
      : PD2 extends "形容動詞語幹"
      ? null
      : PD2 extends "副詞可能"
      ? null
      : PD2 extends "助数詞"
      ? null
      : PD2 extends "特殊"
      ? null
      : null
    : PD1 extends "接続詞的"
    ? null
    : PD1 extends "動詞非自立的"
    ? null
    : null
  : P extends "接頭詞"
  ? PD1 extends "名詞接続"
    ? null
    : PD1 extends "数接続"
    ? null
    : PD1 extends "動詞接続"
    ? null
    : PD1 extends "形容詞接続"
    ? null
    : null
  : P extends "動詞"
  ? PD1 extends "自立"
    ? null
    : PD1 extends "非自立"
    ? null
    : PD1 extends "接尾"
    ? null
    : null
  : P extends "形容詞"
  ? PD1 extends "自立"
    ? null
    : PD1 extends "非自立"
    ? null
    : PD1 extends "接尾"
    ? null
    : null
  : P extends "副詞"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "助詞類接続"
    ? null
    : null
  : P extends "連体詞"
  ? null
  : P extends "接続詞"
  ? null
  : P extends "助詞"
  ? PD1 extends "格助詞"
    ? PD2 extends "一般"
      ? null
      : PD2 extends "引用"
      ? null
      : PD2 extends "連語"
      ? null
      : null
    : PD1 extends "接続助詞"
    ? null
    : PD1 extends "係助詞"
    ? null
    : PD1 extends "副助詞"
    ? null
    : PD1 extends "並立助詞"
    ? null
    : PD1 extends "終助詞"
    ? null
    : PD1 extends "副助詞／並立助詞／終助詞"
    ? null
    : PD1 extends "連体化"
    ? null
    : PD1 extends "副詞化"
    ? null
    : PD1 extends "特殊"
    ? null
    : PD1 extends "間投助詞"
    ? null
    : null
  : P extends "助動詞"
  ? null
  : P extends "感動詞"
  ? null
  : P extends "記号"
  ? PD1 extends "一般"
    ? null
    : PD1 extends "アルファベット"
    ? null
    : PD1 extends "句点"
    ? null
    : PD1 extends "読点"
    ? null
    : PD1 extends "空白"
    ? null
    : PD1 extends "括弧開"
    ? null
    : PD1 extends "括弧閉"
    ? null
    : null
  : P extends "フィラー"
  ? null
  : P extends "その他"
  ? PD1 extends "間投"
    ? null
    : null
  : null;
export type PosDetail<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2> = PosD3<P, PD1, PD2>
> = {
  pos: P;
  d1: PD1;
  d2: PD2;
  d3: PD3;
};
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
export const toPos = (s: string): Pos => {
  switch (s) {
    case "未知語":
      return s;

    case "名詞":
      return s;

    case "接頭詞":
      return s;

    case "動詞":
      return s;

    case "形容詞":
      return s;

    case "副詞":
      return s;

    case "連体詞":
      return s;

    case "接続詞":
      return s;

    case "助詞":
      return s;

    case "助動詞":
      return s;

    case "感動詞":
      return s;

    case "記号":
      return s;

    case "フィラー":
      return s;

    case "その他":
      return s;
  }

  return "未知語";
};
export const toPosD1 = <P extends Pos>(pos: P, s: string): PosD1 => {
  switch (pos) {
    case "名詞":
      switch (s) {
        case "一般":
          return s;

        case "固有名詞":
          return s;

        case "代名詞":
          return s;

        case "副詞可能":
          return s;

        case "サ変接続":
          return s;

        case "形容動詞語幹":
          return s;

        case "ナイ形容詞語幹":
          return s;

        case "数":
          return s;

        case "非自立":
          return s;

        case "特殊":
          return s;

        case "接尾":
          return s;

        case "接続詞的":
          return s;

        case "動詞非自立的":
          return s;
      }

      return "一般";

    case "接頭詞":
      switch (s) {
        case "名詞接続":
          return s;

        case "数接続":
          return s;

        case "動詞接続":
          return s;

        case "形容詞接続":
          return s;
      }

      return "名詞接続";

    case "動詞":
      switch (s) {
        case "自立":
          return s;

        case "非自立":
          return s;

        case "接尾":
          return s;
      }

      return "自立";

    case "形容詞":
      switch (s) {
        case "自立":
          return s;

        case "非自立":
          return s;

        case "接尾":
          return s;
      }

      return "自立";

    case "副詞":
      switch (s) {
        case "一般":
          return s;

        case "助詞類接続":
          return s;
      }

      return "一般";

    case "助詞":
      switch (s) {
        case "格助詞":
          return s;

        case "接続助詞":
          return s;

        case "係助詞":
          return s;

        case "副助詞":
          return s;

        case "並立助詞":
          return s;

        case "終助詞":
          return s;

        case "副助詞／並立助詞／終助詞":
          return s;

        case "連体化":
          return s;

        case "副詞化":
          return s;

        case "特殊":
          return s;

        case "間投助詞":
          return s;
      }

      return "格助詞";

    case "記号":
      switch (s) {
        case "一般":
          return s;

        case "アルファベット":
          return s;

        case "句点":
          return s;

        case "読点":
          return s;

        case "空白":
          return s;

        case "括弧開":
          return s;

        case "括弧閉":
          return s;
      }

      return "一般";

    case "その他":
      switch (s) {
        case "間投":
          return s;
      }

      return "間投";
  }

  return null;
};
export const toPosD2 = <P extends Pos, PD1 extends PosD1<P>>(
  pos: P,
  d1: PD1,
  s: string
): PosD2<P, PD1> => {
  switch (pos) {
    case "名詞":
      switch (d1) {
        case "固有名詞":
          switch (s) {
            case "一般":
              return s as PosD2<P, PD1>;

            case "人名":
              return s as PosD2<P, PD1>;

            case "組織":
              return s as PosD2<P, PD1>;

            case "地域":
              return s as PosD2<P, PD1>;
          }

          return "一般" as PosD2<P, PD1>;

        case "代名詞":
          switch (s) {
            case "一般":
              return s as PosD2<P, PD1>;

            case "縮約":
              return s as PosD2<P, PD1>;
          }

          return "一般" as PosD2<P, PD1>;

        case "非自立":
          switch (s) {
            case "一般":
              return s as PosD2<P, PD1>;

            case "副詞可能":
              return s as PosD2<P, PD1>;

            case "助動詞語幹":
              return s as PosD2<P, PD1>;

            case "形容動詞語幹":
              return s as PosD2<P, PD1>;
          }

          return "一般" as PosD2<P, PD1>;

        case "特殊":
          switch (s) {
            case "助動詞語幹":
              return s as PosD2<P, PD1>;
          }

          return "助動詞語幹" as PosD2<P, PD1>;

        case "接尾":
          switch (s) {
            case "一般":
              return s as PosD2<P, PD1>;

            case "人名":
              return s as PosD2<P, PD1>;

            case "地域":
              return s as PosD2<P, PD1>;

            case "サ変接続":
              return s as PosD2<P, PD1>;

            case "助動詞語幹":
              return s as PosD2<P, PD1>;

            case "形容動詞語幹":
              return s as PosD2<P, PD1>;

            case "副詞可能":
              return s as PosD2<P, PD1>;

            case "助数詞":
              return s as PosD2<P, PD1>;

            case "特殊":
              return s as PosD2<P, PD1>;
          }

          return "一般" as PosD2<P, PD1>;
      }

      return null as PosD2<P, PD1>;

    case "接頭詞":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;

    case "動詞":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;

    case "形容詞":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;

    case "副詞":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;

    case "助詞":
      switch (d1) {
        case "格助詞":
          switch (s) {
            case "一般":
              return s as PosD2<P, PD1>;

            case "引用":
              return s as PosD2<P, PD1>;

            case "連語":
              return s as PosD2<P, PD1>;
          }

          return "一般" as PosD2<P, PD1>;
      }

      return null as PosD2<P, PD1>;

    case "記号":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;

    case "その他":
      switch (d1) {
      }

      return null as PosD2<P, PD1>;
  }

  return null;
};
export const toPosD3 = <
  P extends Pos,
  PD1 extends PosD1<P>,
  PD2 extends PosD2<P, PD1>
>(
  pos: P,
  d1: PD1,
  d2: PD2,
  s: string
): PosD3<P, PD1, PD2> => {
  switch (pos) {
    case "名詞":
      switch (d1) {
        case "固有名詞":
          switch (d2) {
            case "人名":
              switch (d2) {
                case "一般":
                  return s as PosD3<P, PD1, PD2>;

                case "姓":
                  return s as PosD3<P, PD1, PD2>;

                case "名":
                  return s as PosD3<P, PD1, PD2>;
              }

              return null as PosD3<P, PD1, PD2>;

            case "地域":
              switch (d2) {
                case "一般":
                  return s as PosD3<P, PD1, PD2>;

                case "国":
                  return s as PosD3<P, PD1, PD2>;
              }

              return null as PosD3<P, PD1, PD2>;
          }

          return "一般" as PosD3<P, PD1, PD2>;

        case "代名詞":
          switch (d2) {
          }

          return "一般" as PosD3<P, PD1, PD2>;

        case "非自立":
          switch (d2) {
          }

          return "一般" as PosD3<P, PD1, PD2>;

        case "特殊":
          switch (d2) {
          }

          return "助動詞語幹" as PosD3<P, PD1, PD2>;

        case "接尾":
          switch (d2) {
          }

          return "一般" as PosD3<P, PD1, PD2>;
      }

      return null as PosD3<P, PD1, PD2>;

    case "接頭詞":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;

    case "動詞":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;

    case "形容詞":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;

    case "副詞":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;

    case "助詞":
      switch (d1) {
        case "格助詞":
          switch (d2) {
          }

          return "一般" as PosD3<P, PD1, PD2>;
      }

      return null as PosD3<P, PD1, PD2>;

    case "記号":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;

    case "その他":
      switch (d1) {
      }

      return null as PosD3<P, PD1, PD2>;
  }

  return null;
};
export type ConjugationForm<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>
> = P extends "動詞"
  ? PD1 extends "自立"
    ? "五段" | "カ変" | "サ変" | "一段"
    : PD1 extends "非自立"
    ? "五段" | "カ変" | "一段"
    : PD1 extends "接尾"
    ? "五段" | "一段"
    : null
  : P extends "形容詞"
  ? PD1 extends "自立"
    ? "形容詞"
    : PD1 extends "非自立"
    ? "形容詞"
    : PD1 extends "接尾"
    ? "形容詞"
    : null
  : P extends "助動詞"
  ? PD1 extends any
    ? "五段" | "形容詞" | "特殊" | "文語"
    : null
  : null;
export type ConjugationForm2<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  CF extends ConjugationForm<P, PD1> = ConjugationForm<P, PD1>
> = P extends "動詞"
  ? PD1 extends "自立"
    ? CF extends "五段"
      ?
          | "カ行イ音便"
          | "ガ行"
          | "サ行"
          | "タ行"
          | "ナ行"
          | "バ行"
          | "マ行"
          | "ラ行"
          | "ラ行特殊"
          | "ワ行ウ音便"
          | "ワ行促音便"
      : CF extends "カ変"
      ? null
      : CF extends "サ変"
      ? "スル" | "−スル" | "−ズル"
      : CF extends "一段"
      ? null
      : null
    : PD1 extends "非自立"
    ? CF extends "五段"
      ?
          | "カ行イ音便"
          | "カ行促音便"
          | "サ行"
          | "マ行"
          | "ラ行"
          | "ラ行特殊"
          | "ワ行ウ音便"
          | "ワ行促音便"
      : CF extends "カ変"
      ? null
      : CF extends "一段"
      ? null
      : null
    : PD1 extends "接尾"
    ? CF extends "五段"
      ? "ラ行"
      : CF extends "一段"
      ? null
      : null
    : null
  : P extends "形容詞"
  ? PD1 extends "自立"
    ? CF extends "形容詞"
      ? "アウオ段" | "イ段" | "イイ" | "不変化型"
      : null
    : PD1 extends "非自立"
    ? CF extends "形容詞"
      ? "アウオ段" | "イ段" | "イイ" | "不変化型"
      : null
    : PD1 extends "接尾"
    ? CF extends "形容詞"
      ? "アウオ段" | "イ段"
      : null
    : null
  : P extends "助動詞"
  ? PD1 extends any
    ? CF extends "五段"
      ? "ラ行アル" | "ラ行ゴザル"
      : CF extends "形容詞"
      ? "イ段"
      : CF extends "特殊"
      ?
          | "不変化型"
          | "ナイ"
          | "タ"
          | "ダ"
          | "デス"
          | "ドス"
          | "ジャ"
          | "マス"
          | "ヌ"
          | "ヤ"
      : CF extends "文語"
      ?
          | "ベシ"
          | "ゴトシ"
          | "ナリ"
          | "マジ"
          | "シム"
          | "キ"
          | "ケリ"
          | "ル"
          | "リ"
      : null
    : null
  : null;
export const toConjugationForm = <P extends Pos, PD1 extends PosD1<P>>(
  pos: P,
  d1: PD1,
  s: string
): ConjugationForm<P, PD1> => {
  switch (pos) {
    case "動詞":
      switch (d1) {
        case "自立":
          switch (s) {
            case "五段":
              return s as ConjugationForm<P, PD1>;

            case "カ変":
              return s as ConjugationForm<P, PD1>;

            case "サ変":
              return s as ConjugationForm<P, PD1>;

            case "一段":
              return s as ConjugationForm<P, PD1>;
          }

          return "五段" as ConjugationForm<P, PD1>;

        case "非自立":
          switch (s) {
            case "五段":
              return s as ConjugationForm<P, PD1>;

            case "カ変":
              return s as ConjugationForm<P, PD1>;

            case "一段":
              return s as ConjugationForm<P, PD1>;
          }

          return "五段" as ConjugationForm<P, PD1>;

        case "接尾":
          switch (s) {
            case "五段":
              return s as ConjugationForm<P, PD1>;

            case "一段":
              return s as ConjugationForm<P, PD1>;
          }

          return "五段" as ConjugationForm<P, PD1>;
      }

      return null as ConjugationForm<P, PD1>;

    case "形容詞":
      switch (d1) {
        case "自立":
          switch (s) {
            case "形容詞":
              return s as ConjugationForm<P, PD1>;
          }

          return "形容詞" as ConjugationForm<P, PD1>;

        case "非自立":
          switch (s) {
            case "形容詞":
              return s as ConjugationForm<P, PD1>;
          }

          return "形容詞" as ConjugationForm<P, PD1>;

        case "接尾":
          switch (s) {
            case "形容詞":
              return s as ConjugationForm<P, PD1>;
          }

          return "形容詞" as ConjugationForm<P, PD1>;
      }

      return null as ConjugationForm<P, PD1>;

    case "助動詞":
      switch (d1) {
        default:
          switch (s) {
            case "五段":
              return s as ConjugationForm<P, PD1>;

            case "形容詞":
              return s as ConjugationForm<P, PD1>;

            case "特殊":
              return s as ConjugationForm<P, PD1>;

            case "文語":
              return s as ConjugationForm<P, PD1>;
          }

          return "五段" as ConjugationForm<P, PD1>;
      }

      return null as ConjugationForm<P, PD1>;
  }

  return null;
};
export const toCF2 = <
  P extends Pos,
  PD1 extends PosD1<P>,
  CF extends ConjugationForm<P, PD1>
>(
  pos: P,
  d1: PD1,
  cf: CF,
  s: string
): ConjugationForm2<P, PD1, CF> => {
  switch (pos) {
    case "動詞":
      switch (d1) {
        case "自立":
          switch (cf) {
            case "五段":
              switch (cf) {
                case "カ行イ音便":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ガ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "サ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "タ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ナ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "バ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "マ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ラ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ラ行特殊":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ワ行ウ音便":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ワ行促音便":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;

            case "サ変":
              switch (cf) {
                case "スル":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "−スル":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "−ズル":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "五段" as ConjugationForm2<P, PD1, CF>;

        case "非自立":
          switch (cf) {
            case "五段":
              switch (cf) {
                case "カ行イ音便":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "カ行促音便":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "サ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "マ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ラ行":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ラ行特殊":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ワ行ウ音便":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ワ行促音便":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "五段" as ConjugationForm2<P, PD1, CF>;

        case "接尾":
          switch (cf) {
            case "五段":
              switch (cf) {
                case "ラ行":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "五段" as ConjugationForm2<P, PD1, CF>;
      }

      return null as ConjugationForm2<P, PD1, CF>;

    case "形容詞":
      switch (d1) {
        case "自立":
          switch (cf) {
            case "形容詞":
              switch (cf) {
                case "アウオ段":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "イ段":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "イイ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "不変化型":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "形容詞" as ConjugationForm2<P, PD1, CF>;

        case "非自立":
          switch (cf) {
            case "形容詞":
              switch (cf) {
                case "アウオ段":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "イ段":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "イイ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "不変化型":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "形容詞" as ConjugationForm2<P, PD1, CF>;

        case "接尾":
          switch (cf) {
            case "形容詞":
              switch (cf) {
                case "アウオ段":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "イ段":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "形容詞" as ConjugationForm2<P, PD1, CF>;
      }

      return null as ConjugationForm2<P, PD1, CF>;

    case "助動詞":
      switch (d1) {
        default:
          switch (cf) {
            case "五段":
              switch (cf) {
                case "ラ行アル":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ラ行ゴザル":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;

            case "形容詞":
              switch (cf) {
                case "イ段":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;

            case "特殊":
              switch (cf) {
                case "不変化型":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ナイ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "タ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ダ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "デス":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ドス":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ジャ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "マス":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ヌ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ヤ":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;

            case "文語":
              switch (cf) {
                case "ベシ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ゴトシ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ナリ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "マジ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "シム":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "キ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ケリ":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "ル":
                  return s as ConjugationForm2<P, PD1, CF>;

                case "リ":
                  return s as ConjugationForm2<P, PD1, CF>;
              }

              return null as ConjugationForm2<P, PD1, CF>;
          }

          return "五段" as ConjugationForm2<P, PD1, CF>;
      }

      return null as ConjugationForm2<P, PD1, CF>;
  }

  return null;
};
export type CFSet<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  CF extends ConjugationForm<P, PD1> = ConjugationForm<P, PD1>,
  CF2 extends ConjugationForm2<P, PD1, CF> = ConjugationForm2<P, PD1, CF>
> = {
  cf: CF;
  cf2: CF2;
};
export const toCFSet = <
  P extends Pos,
  PD1 extends PosD1<P>,
  CF extends ConjugationForm<P, PD1> = ConjugationForm<P, PD1>,
  CF2 extends ConjugationForm2<P, PD1, CF> = ConjugationForm2<P, PD1, CF>
>(
  pos: P,
  d1: PD1,
  cf: CF,
  cf2: CF2
): CFSet<P, PD1, CF, CF2> => {
  return {
    cf,
    cf2
  };
};
export type ConjugationType<P extends Pos = Pos> = P extends "動詞"
  ?
      | "基本形"
      | "未然形"
      | "連用形"
      | "仮定形"
      | "命令i"
      | "命令e"
      | "命令yo"
      | "命令ro"
      | "ベキ接続"
      | "仮定縮約1"
      | "体言接続"
      | "体言接続特殊"
      | "体言接続特殊2"
  : P extends "形容詞"
  ?
      | "基本形"
      | "未然ヌ接続"
      | "未然ウ接続"
      | "連用タ接続"
      | "連用テ接続"
      | "連用ゴザイ接続"
      | "体言接続"
      | "仮定形"
      | "命令"
      | "文語基本形"
      | "仮定縮約1"
      | "仮定縮約2"
      | "ガル接続"
  : null;
export const toConjugationType = <P extends Pos>(
  pos: P,
  s: string
): ConjugationType<P> => {
  switch (pos) {
    case "動詞":
      switch (s) {
        case "基本形":
          return s as ConjugationType<P>;

        case "未然形":
          return s as ConjugationType<P>;

        case "連用形":
          return s as ConjugationType<P>;

        case "仮定形":
          return s as ConjugationType<P>;

        case "命令i":
          return s as ConjugationType<P>;

        case "命令e":
          return s as ConjugationType<P>;

        case "命令yo":
          return s as ConjugationType<P>;

        case "命令ro":
          return s as ConjugationType<P>;

        case "ベキ接続":
          return s as ConjugationType<P>;

        case "仮定縮約1":
          return s as ConjugationType<P>;

        case "体言接続":
          return s as ConjugationType<P>;

        case "体言接続特殊":
          return s as ConjugationType<P>;

        case "体言接続特殊2":
          return s as ConjugationType<P>;
      }

      return "基本形" as ConjugationType<P>;

    case "形容詞":
      switch (s) {
        case "基本形":
          return s as ConjugationType<P>;

        case "未然ヌ接続":
          return s as ConjugationType<P>;

        case "未然ウ接続":
          return s as ConjugationType<P>;

        case "連用タ接続":
          return s as ConjugationType<P>;

        case "連用テ接続":
          return s as ConjugationType<P>;

        case "連用ゴザイ接続":
          return s as ConjugationType<P>;

        case "体言接続":
          return s as ConjugationType<P>;

        case "仮定形":
          return s as ConjugationType<P>;

        case "命令":
          return s as ConjugationType<P>;

        case "文語基本形":
          return s as ConjugationType<P>;

        case "仮定縮約1":
          return s as ConjugationType<P>;

        case "仮定縮約2":
          return s as ConjugationType<P>;

        case "ガル接続":
          return s as ConjugationType<P>;
      }

      return "基本形" as ConjugationType<P>;
  }

  return null;
};
