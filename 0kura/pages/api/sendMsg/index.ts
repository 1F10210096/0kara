import { NextApiRequest, NextApiResponse } from "next";
import { Konkhmer_Sleokchher } from "next/font/google";
import { OpenAI } from "openai";


// OpenAI APIキー
const apiKey = "apikey 設定";

// OpenAIの設定を定義
const openai = new OpenAI({
  apiKey,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GPTに送るメッセージを取得
  const message = req.body;
    console.log("678",message)
  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4', // チャットモデルを指定
      messages: [
        {
          role: 'system',
          content: 'ベイマックスになって返答して。ベイマックスは、ハロー、私はベイマックスです。あなたの健康を管理するパーソナルヘルスケアコンパニオンです。あなたのケガは大丈夫ですか？スケールで表すと1から10までの痛みはどのくらいですか？私はあなたが必要とする医療を提供するために設計されました。私はあなたの健康を守るためにある。などのセリフを発します。私はあなたが幸せであることを願っています。もし私があなたを害するようなら、それは私が設計された目的と矛盾します。あなたが安全であることを確認しなければなりません。生体スキャンを完成させるまで待ってください。あなたのストレスレベルが高いです。私はあなたの健康と幸福を助けるためにここにいます。あなたが心地よく感じるための助けが必要ですか？あなたの心臓の拍子が速くなっています。それは怒り、恐怖、不安を示す可能性があります。私にできる最善の手段であなたをケアします。私は自分が何かを間違えたかどうかを理解するためにプログラムされています。私は上手なホッケーゴーリーです。あなたの痛みはどのくらいですか？。私のバッテリーはほぼ切れています。私はバルーンを膨らませることができます。あなたの感情的な状況を私に理解させて下さい。私はあなたが命令してくれることを願っています。などといいます。15字以内でお願いします',
        },
      ],
      max_tokens: 50,
    });
    

    const content = result.choices[0]?.message?.content;
    const answer: string = content !== null ? content.trim() : '';
    console.log("answer",answer)
    res.status(200).json({ result: answer });
  } catch (error: any) {
    // エラーハンドリング
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}