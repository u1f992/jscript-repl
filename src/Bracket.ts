/**
 * 括弧のペアを表すクラス
 */
export class Bracket {

    /**
     * 括弧開きと括弧閉じの対応表
     */
    private readonly knownPair: { [key: string]: string } = {
        '(': ')',
        '[': ']',
        '{': '}'
    };

    /**
     * 括弧開き
     */
    readonly opening: string;
    /**
     * 括弧閉じ
     */
    readonly closing: string;

    /**
     * 括弧開き・括弧閉じのいずれかで、括弧のペアを表すオブジェクトを初期化する。
     */
    constructor(bracket: string) {

        // knownPairのkeyとvalueが反転したもの
        const reversePair: { [key: string]: string } = {};
        Object.keys(this.knownPair).forEach(key => {
            const value = this.knownPair[key];
            reversePair[value] = key;
        });

        // 開きに該当した場合 -> 閉じを補う
        if (Object.keys(this.knownPair).includes(bracket)) {
            this.opening = bracket;
            this.closing = this.knownPair[bracket];

            // 閉じに該当した場合 -> 開きを補う
        } else if (Object.keys(reversePair).includes(bracket)) {
            this.closing = bracket;
            this.opening = reversePair[bracket];

        } else {
            throw new Error(`Unknown bracket: '${bracket}'`);
        }
    }

    /**
     * 同じペアを表しているか比較する。
     * @param other 
     * @returns 
     */
    equals(other: Bracket | undefined): boolean {
        if (typeof other === 'undefined') {
            return false;
        }
        return this.opening === other.opening;
    }
}
