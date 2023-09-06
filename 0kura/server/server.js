export const msgUsecase = {
  sendMsg: async (msg) => {
    // メッセージの処理ロジックを実装
    // 例: データベースへの挿入、外部APIへのリクエストなど
    console.log("dawdas")

    // 成功した場合
    return { success: true, message: 'メッセージが送信されました' };

    // エラーの場合
    // throw new Error('エラーメッセージ');
  },
};