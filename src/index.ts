import { REPL } from './repl'

new REPL({
    stdin: WScript.StdIn,
    stdout: WScript.StdOut,
    stderr: WScript.StdErr
}).start();
