import { Code } from "./Code";
import { router } from "./router";

export class REPL {
    private readonly stdin: TextStreamReader;
    private readonly stdout: TextStreamWriter;
    private readonly stderr: TextStreamWriter;
    constructor(io: { stdin: TextStreamReader, stdout: TextStreamWriter, stderr: TextStreamWriter }) {
        this.stdin = io.stdin;
        this.stdout = io.stdout;
        this.stderr = io.stderr;
    }
    private readonly prompts = {
        firstLine: '> ',
        continueLine: '... '
    }
    start() {

        while (true) {

            let code = new Code();
            let prompt = this.prompts.firstLine;

            while (true) {

                // プロンプトを表示して入力を受け付ける
                this.stdout.Write(prompt);
                try {
                    code = code.add(this.stdin.ReadLine());
                } catch (error) { }

                // dot commandが含まれているか検査する
                const command = router.find(code.raw);
                if (command !== null) {
                    command();
                    code = new Code();
                    prompt = this.prompts.firstLine;
                    continue;
                }

                if (code.isClosed()) {
                    break;
                } else {
                    // 複数行に渡って入力を続ける場合は、プロンプトが変わる
                    prompt = this.prompts.continueLine;
                }
            }

            try {
                const ret = eval(code.raw);
                this.stdout.WriteLine(this.styling(ret));

            } catch (error) {
                let message = '';

                // Node.jsっぽく、throwされたものをstringにしてみる
                if (error instanceof Error) {
                    message = `${error.name}: ${error.message}`;

                } else {
                    // ここでエラーが出る分にはしょうがない
                    try {
                        message = this.styling(error);
                    } catch (error) { }
                }

                this.stderr.WriteLine(`Uncaught ${message}`);
            }
        }
    }
    private styling(value: any): string {
        const type = typeof value;
        switch (type) {
            case 'number':
            case 'boolean':
                return '\x1b[33m' + value.toString() + '\x1b[0m';
            case 'string':
                return `\x1b[32m'${value}'\x1b[0m`;
            case 'undefined':
                return `\x1b[38;5;8mundefined\x1b[0m`;
            case 'object':
                const keys = Object.keys(value);
                if (keys.length === 0) {
                    return '{}';
                }
                let stringified = '{ ';
                keys.forEach(key => {
                    stringified += `${key}: ${this.styling(value[key])} ,`
                });
                return stringified.slice(0, -1) + '}';
            default:
                // それ以外は知らん
                try {
                    return value.toString();
                } catch (error) {
                    return '';
                }
        }
    }
}