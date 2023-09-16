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

  const auth = getAuth();

  useEffect(() => {
let eventSource: EventSource | undefined;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        eventSource = new EventSource(`http://localhost:5000/events?userId=${userId}`);
        eventSource.onmessage = function(event) {
          const data = JSON.parse(event.data);
          console.log('Received data:', data);
      
          if (data && data.roomNumber !== undefined) {
              console.log('Received room number:', data.roomNumber);

          } else {
              console.error('roomNumber is missing in the received data');
          }
      };
      }
    });

    // Cleanup
    return () => {
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