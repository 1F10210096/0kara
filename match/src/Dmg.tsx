import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './2.jpg';
import userImage from './user.png';
import { AppstoreOutlined, MailOutlined, SettingOutlined ,UserOutlined,UserAddOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import axios from 'axios';
import { send } from 'process';
import { uuidV4 } from '@skyway-sdk/room';
import P2p from './p2p-room/src/main';
import { Modal } from 'antd';
import Tutorial from './tutorial/src/Tutorial';
import MatchingComponent from './match';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ReactplosiveModal from "reactplosive-modal";
// import socketIOClient from "socket.io-client";
import { set } from 'mongoose';
import Like from './like';
// import './card.css';
// import './a.css';
const API_ENDPOINT = 'http://localhost:5000';  // あなたのバックエンドのエンドポイント

const items: MenuProps['items'] = [
  {
    label: 'いいねされた人',
    key: 'mail',
    icon: <UserAddOutlined />,
  },
  {
    label: 'メッセージ',
    key: 'app',
    icon: <UserOutlined />,
  },
  {
    label: '設定',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
];


const bgStyle = {
  display: 'flex',
  height: '16vh',
  width: '28vw',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover'
};


const bg2Style: React.CSSProperties = {
  backgroundImage: `url(${userImage})`,
  backgroundSize: 'cover', 
  backgroundPosition: 'left center', 
  zIndex: 10,
  width: '80px',
  height: '78px',
  position: 'fixed', 
  left: '30px',      
  top: '20px',
};
const bg3Style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '88vh',
  width: '29vw',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  borderRight: '1px solid #e1e1e1'
};
const bg4Style: React.CSSProperties = {
  display: 'flex',
  height: '100vh',
  width: '70vw',
  position: 'absolute',
  top: '1px',
  left: '430px',
  backgroundSize: 'cover',
  border: '1px solid #e1e1e1'
};





const Dmg: React.FC = () => {
    const navigate = useNavigate();
    const [showP2p, setShowP2p] = useState(true);
    const [isInWaitingList, setIsInWaitingList] = useState(false);
    const [current, setCurrent] = useState('Dmg');
    const roomNameInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [usernames, setUsernames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUserID] = useState('');

    const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    setUserID(uid);
    console.log(uid)
    // ...
  } else {
    // User is signed out
    // ...
  }
});

    //test
    useEffect(() => {
      fetch('http://localhost:5000/getUsers')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // usernameだけを取り出して新しい配列に格納
            const extractedUsernames = data.users.map((user: { username: any; }) => user.username);
            
            // usernames stateにセット
            setUsernames(extractedUsernames);
          } else {
            setError(data.message || 'An error occurred');
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    //test
    const showModal = () => {
      setIsModalOpen(true);
    };
  
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

  
  const search = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/tutorial');
  };
  const Friend = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    navigate('/friend');
  };

  const [open1, setOpen1] = useState(false);

  const showModal1 = () => {
    // setIsModalVisible(tr);
  };

  const handleOk1 = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen1(false);
  };

  const handleCancel1 = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen1(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  

  const userId = user


  const initialProfile: ProfileType = {
    ok: 'username',
    nickname: '',
    gender: '',
    age: '',
    comment: '',
    photo: '',
    // 他の必要なプロパティもここに追加してください
  };

  
  useEffect(() => {
    let attemptCount = 0; // APIを呼び出す試行回数を制限するための変数
    const maxAttempts = 10; // 最大試行回数
    const intervalTime = 5000; // 5秒ごとにAPIを呼び出す
  
    const intervalId = setInterval(async () => {
      if (user) {
        try {
          console.log("oiuy");
          const response = await fetch('http://localhost:5000/getUserProfile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user })
          });
          console.log("djaidwji")
          const data = await response.json();

          if (data.success) {
            console.log(data.profile)
            setProfile(data.profile);
            clearInterval(intervalId); // プロファイルが取得できたら繰り返しを停止
          } else {
            console.error(data.message);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
  
      attemptCount++;
      if (attemptCount >= maxAttempts) {
        clearInterval(intervalId); // 最大試行回数に達したら繰り返しを停止
      }
    }, intervalTime);
  
    // コンポーネントのアンマウント時にintervalをクリアする
    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  
  const [profile, setProfile] = useState<ProfileType>(initialProfile);

  useEffect(() => {
    let attemptCount = 0; // APIを呼び出す試行回数を制限するための変数
    const maxAttempts = 10; // 最大試行回数
    const intervalTime = 5000; // 5秒ごとにAPIを呼び出す
  
    const intervalId = setInterval(async () => {
      if (user) {
        try {
          console.log(user);
          const response = await fetch('http://localhost:5000/getUserProfile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user })
          });
          console.log("djaidwji")
          const data = await response.json();

          if (data.success) {
            console.log(data.profile)
            setProfile(data.profile);
            clearInterval(intervalId); // プロファイルが取得できたら繰り返しを停止
          } else {
            console.error(data.message);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
  
      attemptCount++;
      if (attemptCount >= maxAttempts) {
        clearInterval(intervalId); // 最大試行回数に達したら繰り返しを停止
      }
    }, intervalTime);
  
    // コンポーネントのアンマウント時にintervalをクリアする
    return () => {
      clearInterval(intervalId);
    };
  }, [user]);
  // ユーザ

  function joinRoom(roomName: string) {
    if (roomNameInputRef.current) {
      roomNameInputRef.current.value = roomName;  // inputに部屋名をセット
    }
  
    const joinButton = document.getElementById('join'); 
    if (joinButton) {
      joinButton.click();  // ボタンのクリックイベントを強制的にトリガー
    }
  }
  
  
  function generateRandomRoomName() {
    return `room_${uuidV4()}`; // uuidを使ってユニークな部屋名を生成
  }

  interface LikedProfilesResponse {
    success: boolean;
    likedProfiles?: string[];
    message?: string;
}

  const [likedProfiles, setLikedProfiles] = useState<string[]>([]); 
  const [attemptCount, setAttemptCount] = useState(0);
  const intervalTime = 5000;

  const maxAttempts = 5; // 例として5回のリトライを指定
useEffect(() => {
  if (!user) return; // userが存在しない場合、intervalをセットアップしない

  const intervalId = setInterval(async () => {
    try {
      console.log("Fetching liked profiles...");
      const response = await fetch(`http://localhost:5000/getLikedProfiles?myId=${user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Response received.");
      const data = await response.json();

      if (data.success) {
        console.log(data.likedProfiles);
        setLikedProfiles(data.likedProfiles);
        clearInterval(intervalId); // liked profilesが取得できたら繰り返しを停止
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('Error fetching liked profiles:', err);
    }

    setAttemptCount(prevAttempt => prevAttempt + 1); // attemptCountを更新

    if (attemptCount >= maxAttempts) {
      clearInterval(intervalId); // 最大試行回数に達したら繰り返しを停止
    }
  }, intervalTime);

  // コンポーネントのアンマウント時にintervalをクリアする
  return () => {
    clearInterval(intervalId);
  };
}, [user, attemptCount, maxAttempts, intervalTime]);
  // console.log(room12)
  // Tutorial(room12);
//   const eventSource = new EventSource('http://localhost:5000/events?userId=${userId}');
//   eventSource.onmessage = function(event) {
//     const data = JSON.parse(event.data);
    
//     const roomNumber = data.roomNumber;
//     const matchedUserId = data.matchedUserId;

//     console.log(`マッチした部屋番号: ${roomNumber}`);
//     console.log(`マッチしたユーザーID: ${matchedUserId}`);
    
//     // 必要に応じてDOMの更新や他の処理をここに追加
// };eventSource.onerror = function(event) {
//   console.error('エラーが発生しました:', event);
//   eventSource.close();
// };
type ProfileType = {
  ok: string;
  nickname: string;
  gender: string;
  age: string;
  comment: string;
  photo: string;
  // 他の必要なプロパティもここに追加してください
};




// const [socket, setSocket] = useState(null);

// useEffect(() => {
//   // ソケットの接続
//   const newSocket = socketIOClient(API_ENDPOINT;
//   setSocket(newSocket);

//   return () => {
//     // コンポーネントがアンマウントされるとき、ソケットの接続を切断します。
//     newSocket.disconnect();
//   }
// }, []);

// useEffect(() => {
//   if (!socket) return;

//   // イベントリスナーの例
//   socket.on('connect', () => {
//     console.log('Connected to the server');
//   });

//   // 必要に応じて他のイベントリスナーをここに追加
// }, [socket]);





  return ( <><div style={bgStyle} onClick={showModal1}><Link to="/dm" style={bg2Style}></Link> <div style={{ color: "white", fontSize: "24px" }}>
  {profile.nickname}
</div> 
       <div className="container">
     <section className="containerInner">
       {/* <h2 className="header">Modal title</h2> */}
  
       <div className="buttonContainer">
       </div>
     </section>
   </div>
  </div>

  <Menu style={{ height: '50px' }} selectedKeys={[current]} mode="horizontal" items={items} />
<div style={bg3Style}> 
  <Like></Like>
  {
    Array.isArray(likedProfiles[0]) && likedProfiles[0].map((profileId, index) => (
      <div key={index} style={{ border: '1px solid black', margin: '5px', padding: '5px', display: 'block' }}>
  {profileId}
</div>
    ))
  }
</div>
<div style={bg4Style}>

    {/* その他のコンポーネントや要素 */}
    <MatchingComponent />
    <>
      {/* 他のコード */}
    </>
    { showP2p && <Tutorial /> }
  </div>

  {/* <Button icon={<SearchOutlined />} onClick={search}>Search</Button>
      <Button icon={<SearchOutlined />} onClick={Friend}>Friend</Button> */}

  </>
  );
};

export default Dmg;