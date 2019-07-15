import {
  Pos,
  PosD1,
  PosD2,
  PosD3,
  ConjugationType,
  ConjugationForm1,
  ConjugationForm2,
  ConjugationForm
} from "../types/ipadic/generated";

export interface IpadicFeatures<
  P extends Pos = Pos,
  PD1 extends PosD1<P> = PosD1<P>,
  PD2 extends PosD2<P, PD1> = PosD2<P, PD1>,
  PD3 extends PosD3<P, PD1, PD2> = PosD3<P, PD1, PD2>,
  CF1 extends ConjugationForm1<P, PD1> = ConjugationForm1<P, PD1>,
  CF2 extends ConjugationForm2<P, PD1, CF1> = ConjugationForm2<P, PD1, CF1>
> {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: P;
  pos_detail_1: PD1;
  pos_detail_2: PD2;
  pos_detail_3: PD3;
  conjugated_type: ConjugationType<P>;
  conjugated_form: ConjugationForm<P, PD1, CF1, CF2>;
  basic_form: string;
  reading?: string;
  pronunciation?: string;
}
