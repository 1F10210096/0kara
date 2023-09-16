import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const Like = () => {
  const [socket, setSocket] = useState(null);
  const [likes, setLikes] = useState([]);

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

    socket.on('newLikeAdded', (data) => {
      console.log(`User with ID ${data.myId} liked user with ID ${data.userId} whose profile is ${data.profile.nickname}`);
      setLikes(prevLikes => [...prevLikes, data]);
    });

  }, [socket]);

  const getBoxShadow = (index) => {
    const shadows = [
      "rgba(0, 0, 0, 0.09) 0px 2px 1px",
      "rgba(0, 0, 0, 0.09) 0px 4px 2px",
      "rgba(0, 0, 0, 0.09) 0px 8px 4px",
      "rgba(0, 0, 0, 0.09) 0px 16px 8px",
      "rgba(0, 0, 0, 0.09) 0px 32px 16px"
    ];
    return shadows[index % shadows.length];
  }

  return (
<div style={{ border: '1px solid #e1e1e1', width: '100%',height:'100%' }}>
      <ul>
        {likes.map((like, index) => (
          <li key={index} style={{ border: '2px solid #e1e1e1', padding: '15px', margin: '15px', boxShadow: getBoxShadow(index) }}>
            <p>ニックネーム: {like.profile.nickname}</p>
            <p>年齢: {like.profile.age}</p>
            <p>ひと言: {like.profile.comment}</p>
          </li>
        ))}
      </ul>
    </div>
);
}

export default Like;

