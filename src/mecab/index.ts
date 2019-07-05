import { spawn, ChildProcess } from "child_process";
class MeCab {
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

    const promise = new Promise<string>(resolve => {
      this.process.stdout.on("data", chunk => {
        resolve(chunk.toString("utf8"));
      });
    });
    this.process.stdin.write(str + "\n");
    return promise;
  }

  private resultParse(resultString: string) {
    const result = resultString.split("\n").map(line => {
      const [word, features] = line.split("\t");

      return [word, ...features.split(",")];
    });
  }

  close() {
    if (this.process && !this.process.killed) {
      this.process.kill("SIGINT");
    }
  }
}

const mecab = new MeCab();
mecab.spawn();
mecab
  .parse("お高い")
  .then(s => console.log(s))
  .finally(() => {
    mecab.close();
  });
