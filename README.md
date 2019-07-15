# Katame

IPADic+Mecab・Kuromoji.js などが出力する品詞・活用形・活用型を型づけしたものです。

## なぜ作った

「ですますだである」変換器を作っていて、マニュアルとにらめっこしながら活用型に startsWith を掛けてばかすこ書くのがめんどくさかったので、活用型だけは型づけしたかった。

で、どうせだからということで活用型だけでなく活用形と品詞も型づけした。

で、素の TS 書くのめんどくさかったので YAML で書いて TS に変換することにした。

## 使い方

```
git clone https://github.com/KimotoYanke/katame.git
cd katame
yarn type # 型情報をYAMLで記述しているので、TypeScriptの型情報を生成
ts-node src/mecab/index.ts
```

## 典拠

### IPADic

「ipadic version 2.7.0 ユーザーズマニュアル」から。動詞の文語系は実装していません。
