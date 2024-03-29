import {
  PosDetail,
  toPosDetail,
  toPos,
  toPosD1,
  toPosD2,
  toPosD3,
  toCFSet,
  toCF1,
  toCF2,
  CFSet,
  Pos,
  PosD1,
  PosD2,
  PosD3,
  ConjugationForm,
  ConjugationForm2,
  toConjugationType as toConjugationType_,
  ConjugationForm1
} from "./generated";
import { toNarrowAlphanumeric } from "jaco";

interface IPADicParsedResult<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2> = PosD3<P, PD1, PD2>,
  CF1 extends ConjugationForm1<P, PD1> = ConjugationForm1<P, PD1>,
  CF2 extends ConjugationForm2<P, PD1, CF1> = ConjugationForm2<P, PD1, CF1>
> {
  surface: string;
  posDetail: PosDetail<P, PD1, PD2, PD3>;
  conjugationForm: CFSet<P, PD1, CF1, CF2>;
  conjugationType: string;
  basic: string;
  reading: string;
  pronunciation: string;
}

const toConjugationType = (pos: Pos, ctStr: string) =>
  toConjugationType_(pos, toNarrowAlphanumeric(ctStr));

export const toIPADicParsedResult = (line: string): IPADicParsedResult => {
  const [surface, features] = line.split("\t");
  const [
    posStr,
    pd1Str,
    pd2Str,
    pd3Str,
    cfSetStr,
    ctStr,
    basic,
    reading,
    pronunciation
  ] = (features || "").split(",").map(str => (str !== "*" ? str : null));

  const pos = toPos(posStr);
  const pd1 = toPosD1(pos, pd1Str);
  const pd2 = toPosD2(pos, pd1, pd2Str);
  const pd3 = toPosD3(pos, pd1, pd2, pd3Str);
  const posDetail = toPosDetail(pos, pd1, pd2, pd3);
  const [cfStr, cf2Str] = cfSetStr.split("・", 2);
  const cf1 = toCF1(pos, pd1, cfStr);
  const cf2 = toCF2(pos, pd1, cf1, cf2Str);
  const conjugationForm = toCFSet(pos, pd1, cf1, cf2);
  const conjugationType = toConjugationType(pos, ctStr);
  return {
    surface,
    posDetail,
    conjugationForm,
    conjugationType,
    basic,
    reading,
    pronunciation
  };
};
