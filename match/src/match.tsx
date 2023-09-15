import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth"
function MatchingListener() {
    const [userID, setUserID] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState(null);
  const [matchedUserId, setMatchedUserId] = useState(null);
console.log("dadsadsda")
  useEffect(() => {
    const auth = getAuth();

    // Firebaseの認証状態の変更を監視するリスナーを設定
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserID(uid);
      } else {
        setUserID(null);
      }
    });

    // コンポーネントがアンマウントされたときにリスナーを解除
    return () => unsubscribe();

  }, []);

  useEffect(() => {
    let eventSource: EventSource;
  
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        eventSource = new EventSource(`http://localhost:5000/matchUser/${userId}`);
        
        eventSource.onmessage = function(event) {
          console.log("Received data:", event.data);
          const data = JSON.parse(event.data);
  
          if (data.roomNumber) {
            setRoomNumber(data.roomNumber);
          }
  
          if (data.matchedUserId) {
            setMatchedUserId(data.matchedUserId);
          }
        };
  
        eventSource.onerror = function(error) {
          console.error("EventSource failed:", error);
        };
  
      } else {
        setUserID(null);
      }
    });
  
    // Cleanup
    return () => {
      unsubscribe();
      if (eventSource) {
        eventSource.close();
      }
    }
  }, []);

  return (
    <div>
      {roomNumber && <div>Room Number: {roomNumber}</div>}
      {matchedUserId && <div>Matched with user ID: {matchedUserId}</div>}
    </div>
  );
}

export default MatchingListener;