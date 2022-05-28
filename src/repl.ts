import { Code } from "./code";

export class REPL {
    private readonly _stdin: TextStreamReader;
    private readonly _stdout: TextStreamWriter;
    private readonly _stderr: TextStreamWriter;
    constructor(io: { stdin: TextStreamReader, stdout: TextStreamWriter, stderr: TextStreamWriter }) {
        this._stdin = io.stdin;
        this._stdout = io.stdout;
        this._stderr = io.stderr;
    }
    start() {
        while (true) {

            let code = new Code();
            let prompt = '> ';

            while (true) {

                // プロンプトを表示して入力を受け付ける
                this._stdout.Write(prompt);
                try {
                    code = code.add(this._stdin.ReadLine());
                } catch (error) { }

                if (code.isClosed()) {
                    break;
                } else {
                    // 複数行に渡って入力を続ける場合は、プロンプトが変わる
                    prompt = '... ';
                }
            }

            try {
                const ret = eval(code.raw);
                this._stdout.WriteLine(ret);

            } catch (error) {
                let message = '';

                // Node.jsっぽく、throwされたものをstringにしてみる
                if (error instanceof Error) {
                    message = `${error.name}: ${error.message}`;

                } else {
                    if (typeof error === 'number' || typeof error === 'boolean') {
                        message = error.toString();

                    } else if (typeof error === 'string') {
                        message = `'${error}'`;

                    } else {
                        // ここでエラーが出る分にはしょうがない
                        try {
                            message = (error as any).toString();
                        } catch (error) { }
                    }
                }

                this._stderr.WriteLine(`Uncaught ${message}`);
            }
        }
    }
}