import { PosDetail } from "./types/ipadic-pos";

interface ParsedResult<PD extends PosDetail> {
  surface: string;
  posDetail: PD;
  conjugationForm: string;
  conjugationType: string;
  basic: string;
  reading: string;
  pronunciation: string;
}
