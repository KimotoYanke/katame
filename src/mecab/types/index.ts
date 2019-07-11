import {
  PosDetail,
  toPosDetail,
  toPos,
  toPosD1,
  toPosD2,
  toPosD3
} from "./generated/type";

interface ParsedResult<PD extends PosDetail = PosDetail> {
  surface: string;
  posDetail: PD;
  conjugationForm: string;
  conjugationType: string;
  basic: string;
  reading: string;
  pronunciation: string;
}

export const toParsedResult = (line: string): ParsedResult => {
  const [surface, features] = line.split("\t");
  const [
    posStr,
    pd1Str,
    pd2Str,
    pd3Str,
    conjugationForm,
    conjugationType,
    basic,
    reading,
    pronunciation
  ] = (features || "").split(",").map(str => (str !== "*" ? str : null));

  const pos = toPos(posStr);
  const pd1 = toPosD1(pos, pd1Str);
  const pd2 = toPosD2(pos, pd1, pd2Str);
  const pd3 = toPosD3(pos, pd1, pd2, pd3Str);
  return {
    surface,
    posDetail: toPosDetail(pos, pd1, pd2, pd3),
    conjugationForm,
    conjugationType,
    basic,
    reading,
    pronunciation
  };
};
