import { IpadicFeatures } from "./ipadic";
import * as kuromoji from "kuromoji";

export const kuromojiBuilder = (option: kuromoji.TokenizerBuilderOption) => {
  return new Promise<kuromoji.Tokenizer<IpadicFeatures>>((resolve, reject) => {
    kuromoji.builder(option).build((err, tokenizer) => {
      if (err) {
        reject(err);
      }
      resolve(tokenizer as kuromoji.Tokenizer<IpadicFeatures>);
    });
  });
};
