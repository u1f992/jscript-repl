import { Code } from "./code";

const stdin = WScript.StdIn;
const stdout = WScript.StdOut;
const stderr = WScript.StdErr;

while (true) {

    let code = new Code();
    let prompt = '> ';

    while (true) {

        // プロンプトを表示して入力を受け付ける
        stdout.Write(prompt);
        try {
            code = code.add(stdin.ReadLine());
        } catch (error) {}

        if (code.isClosed()) {
            break;
        } else {
            // 複数行に渡って入力を続ける場合は、プロンプトが変わる
            prompt = '... ';
        }
    }

    try {
        const ret = eval(code.raw);
        stdout.WriteLine(ret);
        
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
                } catch (error) {}
            }            
        }

        stderr.WriteLine(`Uncaught ${message}`);
    }
}
