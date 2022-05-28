import { Code } from "./code";
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
                this.stdout.WriteLine(ret);

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

                this.stderr.WriteLine(`Uncaught ${message}`);
            }
        }
    }
}