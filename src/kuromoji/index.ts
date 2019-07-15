import { IpadicFeatures } from "./ipadic";
import { TokenizerBuilderOption, Tokenizer } from "kuromoji";
export let kuromojiBuilder:
  | null
  | ((
      option: TokenizerBuilderOption
    ) => Promise<Tokenizer<IpadicFeatures>>) = null;
try {
  let kuromoji = require("kuromoji");
  kuromojiBuilder = (option: TokenizerBuilderOption) => {
    return new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
      import("kuromoji").then(kuromoji =>
        kuromoji.builder(option).build((err, tokenizer) => {
          if (err) {
            reject(err);
          }
          resolve(tokenizer as Tokenizer<IpadicFeatures>);
        })
      );
    });
  };
} catch (error) {}
