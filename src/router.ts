interface DotCommand { regexp: RegExp, func: Function }
class Router {
    
    // (スペースor行頭)<.command>行末
    private readonly commands: { [key: string]: DotCommand } = {
        break: {
            regexp: /(\s|^)\.break($|\n|\r\n)/,
            func: () => { }
        },
        clear: {
            regexp: /(\s|^)\.clear($|\n|\r\n)/,
            func: () => { }
        },
        exit: {
            regexp: /(\s|^)\.exit($|\n|\r\n)/,
            func: () => { WScript.Quit(0); }
        },
        help: {
            regexp: /(\s|^)\.help($|\n|\r\n)/,
            func: () => { WScript.StdOut.Write(`.break    Sometimes you get stuck, this gets you out
.clear    Alias for .break
.exit     Exit the REPL
.help     Print this help message
.load     Load JS from a file into the REPL session
.save     Save all evaluated commands in this REPL session to a file

`); }
        },
        load: {
            regexp: /(\s|^)\.load($|\n|\r\n)/,
            func: () => { WScript.StdOut.WriteLine("not implemented"); }
        },
        save: {
            regexp: /(\s|^)\.save($|\n|\r\n)/,
            func: () => { WScript.StdOut.WriteLine("not implemented"); }
        }
    };
    private readonly keys = Object.keys(this.commands);

    /**
     * 文字列にコマンドが存在するか
     * @param code 
     * @returns 
     */
    find(code: string): Function | null {

        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            if (code.match(this.commands[key].regexp) !== null) {
                return this.commands[key].func;
            }
        }
        return null;
    }
}
export const router = new Router();
