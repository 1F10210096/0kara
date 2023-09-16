import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const Like = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // ソケットの接続
    const newSocket = socketIOClient(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      // コンポーネントがアンマウントされるとき、ソケットの接続を切断します。
      newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // イベントリスナーの例
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // 必要に応じて他のイベントリスナーをここに追加
  }, [socket]);

  return (
    <div>
      {/* ここにコンポーネントのUIを描画 */}
    </div>
  );
}

export default Like;