import { Bracket } from "./bracket";

/**
 * コードを表すクラス
 */
export class Code {

    /**
     * コード実体
     */
    readonly raw: string;
    /**
     * 改行コード
     */
    private readonly newline: string = '\n';

    /**
     * コードを表すオブジェクトを初期化する。
     * @param code 
     */
    constructor(code?: string) {
        if (typeof code === 'undefined') {
            this.raw = '';
        } else {
            this.raw = (code + this.newline);
        }
    }

    /**
     * コードを追加して新たなオブジェクトを生成する。
     * @param code 
     * @returns 
     */
    add(code: string): Code {
        return new Code(this.raw + code);
    }

    /**
     * 括弧が閉じているか確認する。
     * @returns 
     */
    isClosed(): boolean {

        const code = this.raw;
        const stack: Bracket[] = [];
        const brackets = [new Bracket('('), new Bracket('['), new Bracket('{')];
        
        for (let i = 0; i < code.length; i++) {
            
            const char = code.charAt(i);

            // 括弧開きに該当した場合
            if (brackets.some((bracket) => bracket.opening === char)) {

                // スタックに括弧を追加
                stack.push(new Bracket(char));
                continue;
            }

            // 括弧閉じに該当した場合
            if (brackets.some((bracket) => bracket.closing === char)) {
                
                // 直前に追加した括弧と対応していなければ不整合
                const found = stack.pop();
                if (!(new Bracket(char).equals(found))) {
                    return false;
                } else {
                    continue;
                }
            }
        }

        // スタックが空でなければ、閉じ忘れている
        return stack.length === 0;
    }
}
