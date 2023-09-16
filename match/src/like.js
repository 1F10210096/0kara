import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const Like = () => {
  const [socket, setSocket] = useState(null);
  const [likes, setLikes] = useState([]);  // 新しいいいねのデータとプロフィール情報を保存するための状態

  useEffect(() => {
    const newSocket = socketIOClient(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // 'newLikeAdded'イベントをリッスンしてデータを受け取る
    socket.on('newLikeAdded', (data) => {
      console.log(`User with ID ${data.myId} liked user with ID ${data.userId} whose profile is ${data.profile.nickname}`);
      setLikes(prevLikes => [...prevLikes, data]);
    });

  }, [socket]);

  return (
    <div>
      <h2>Likes</h2>
      <ul>
        {likes.map((like, index) => (
          <li key={index}>
            User with ID {like.myId} liked user with ID {like.userId}.
            <p>Nickname: {like.profile.nickname}</p>
            {/* 必要に応じて他のプロフィール情報を表示 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Like;
