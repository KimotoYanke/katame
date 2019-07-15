import { spawn, ChildProcess } from "child_process";
import { toIPADicParsedResult } from "../types/ipadic";
class Mecab {
  cmd: string = "mecab";
  args: string[] = [];

  private process: ChildProcess | null = null;
  spawn() {
    this.process = spawn(this.cmd, [...this.args, "--eos-format="]);
  }

  parse(str: string) {
    if (!this.process) {
      throw new Error("This MeCab process is not spawned");
    }
    if (this.process.killed) {
      throw new Error("This MeCab process is killed");
    }

    const promise = new Promise<string[]>((resolve, reject) => {
      this.process.stdout.on("data", chunk => {
        const s = chunk.toString("utf8").trim();
        resolve(s.split("\n"));
      });
    });
    this.process.stdin.write(str + "\n");
    return promise;
  }

  close() {
    if (this.process && !this.process.killed) {
      this.process.kill("SIGINT");
    }
  }
}

const mecab = new Mecab();
mecab.spawn();
mecab
  .parse("欲しけりゃ")
  .then(lines => lines.forEach(s => console.log(toIPADicParsedResult(s))))
  .finally(() => {
    mecab.close();
  });
