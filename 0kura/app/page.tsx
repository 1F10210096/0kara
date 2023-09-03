"use client";
import { useEffect, useState } from "react";

const Home = () => {
  const [msg, setMsg] = useState('');
  
  // サーバーサイドからのデータを受け取るためのステート
  const [serverResponse, setServerResponse] = useState('');

  const onMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const sendMsgs = async () => {
    try {
      // サーバーサイドの関数を呼び出し、データを受け取る
      const response = await fetch('/api/sendMsg', {
        method: 'POST',
        body: JSON.stringify({ msg }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // サーバーサイドからのデータをステートに設定
      setServerResponse(data.message);
    } catch (error) {
      console.error("dawd",error);
    }
  };

  useEffect(() => {
    // サーバーサイドからのデータをコンソールに表示
    console.log(serverResponse);
  }, [serverResponse]);

  return (
    <>
      <input type="text" value={msg} onChange={onMsgChange} />
      <button onClick={sendMsgs}>メッセージを送信</button>
    </>
  );
};

export default Home;