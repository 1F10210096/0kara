import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from '@skyway-sdk/room';
import { EditOutlined, EllipsisOutlined, SettingOutlined, HeartOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { appId, secret } from '../../p2p-room/src/env';
import { useEffect } from 'react';
import './index.css';
import axios from 'axios';
import { useState} from 'react';
import { set } from 'mongoose';


const auth = getAuth();
const { Meta } = Card;

// var animateButton = function(e) {

//   e.preventDefault;
//   //reset animation
//   e.target.classList.remove('animate');
  
//   e.target.classList.add('animate');
//   setTimeout(function(){
//     e.target.classList.remove('animate');
//   },700);
// };

// var bubblyButtons = document.getElementsByClassName("bubbly-button");

// for (var i = 0; i < bubblyButtons.length; i++) {
//   bubblyButtons[i].addEventListener('click', animateButton, false);
// }


function Tutorial(room12) {
  const [roomName, setRoomName] = useState('');
  const [matchedUserId, setMatchedUserId] = useState(null);
  const [MyId, setMyId] = useState(null);

  const [profile, setProfile] = useState({});
  
  useEffect(() => {
    let eventSource;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setMyId(userId);
        eventSource = new EventSource(`http://localhost:5000/events?userId=${userId}`);
        eventSource.onmessage = function(event) {
          const data = JSON.parse(event.data);
          console.log('Received data:', data);
      
          if (data && data.roomNumber !== undefined) {
              console.log('Received room number:', data.roomNumber);
              setRoomName(data.roomNumber.toString());
          } else {
              console.error('roomNumber is missing in the received data');
          }


              // matchedUserIdの存在を確認して、存在する場合はステートを更新
    if (data && data.matchedUserId) {
      setMatchedUserId(data.matchedUserId);
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

  const handleLikeClick = () => {
    console.log({ myId: MyId, userId: matchedUserId });
    axios.post('http://localhost:5000/likeUser', { myId:MyId, userId: matchedUserId })
      .then(response => {
        if (response.data.success) {
          console.log("Liked the user successfully.");
        } else {
          console.error("Error liking the user.");
        }
      })
      .catch(error => {
        console.error('Error sending like:', error);
      });
  };


  const [userProfile, setUserProfile] = useState(null);
  const [backendResponse, setBackendResponse] = useState('');
  
  useEffect(() => {
    if (matchedUserId) {
      console.log("juhnh")
      axios.post('http://localhost:5000/getUserProfile', { userId: matchedUserId })
        .then(response => {
          if (response.data.success) {
            setUserProfile(response.data.profile);
            console.log(response.data.profile);
            setProfile(response.data.profile);
          } else {
            setBackendResponse('No profile found for the given matchedUserId.');
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setBackendResponse('Error fetching user profile.');
        });
    }
  }, [matchedUserId]);

  
  const token = new SkyWayAuthToken({
    jti: uuidV4(),
    iat: nowInSec(),
    exp: nowInSec() + 60 * 60 * 24,
    scope: {
      app: {
        id: appId,
        turn: true,
        actions: ['read'],
        channels: [
          {
            id: '*',
            name: '*',
            actions: ['write'],
            members: [
              {
                id: '*',
                name: '*',
                actions: ['write'],
                publication: {
                  actions: ['write'],
                },
                subscription: {
                  actions: ['write'],
                },
              },
            ],
            sfuBots: [
              {
                actions: ['write'],
                forwardings: [
                  {
                    actions: ['write'],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }).encode(secret);
  
  async function setupSkyway(room12) {
    try {
    console.log('setupSkyway');
    const localVideo = document.getElementById('local-video');
    const buttonArea = document.getElementById('button-area');
    const remoteMediaArea = document.getElementById('remote-media-area');
    const roomNameInput = document.getElementById('room-name');
    const myId = document.getElementById('my-id');
    const joinButton = document.getElementById('join');
  console.log('setupSkyway2');
    const { audio, video } =
      await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
    video.attach(localVideo);
    await localVideo.play();
  console.log('setupSkyway3');
    joinButton.onclick = async () => {
      if (roomNameInput.value === '') return;
  
      const context = await SkyWayContext.Create(token);
      console.log(roomNameInput.value)
      // roomNameInput.value = roomName
      const room = await SkyWayRoom.FindOrCreate(context, {
        type: 'p2p',
        name: roomNameInput.value,
      });
      const me = await room.join();
      myId.textContent = me.id;
      await me.publish(audio);
      await me.publish(video);
      const subscribeAndAttach = (publication) => {
        if (publication.publisher.id === me.id) return;
        const subscribeButton = document.createElement('button');
        subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
        buttonArea.appendChild(subscribeButton);
        subscribeButton.onclick = async () => {
          const { stream } = await me.subscribe(publication.id);
          let newMedia;
          switch (stream.track.kind) {
            case 'video':
              newMedia = document.createElement('video');
              newMedia.playsInline = true;
              newMedia.autoplay = true;
              break;
            case 'audio':
              newMedia = document.createElement('audio');
              newMedia.controls = true;
              newMedia.autoplay = true;
              break;
            default:
              return;
          }
          stream.attach(newMedia);
          remoteMediaArea.appendChild(newMedia);
        };
      };
      room.publications.forEach(subscribeAndAttach);
      room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
    };
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
  };
  useEffect(() => {
    setupSkyway(room12);
  }, []); 

  
  return (
    <div>
      {/* デバックしたければ */}
      {/* <p>ID: <span id="my-id"></span></p> */}
      {/* <div>
        room name: <input id="room-name" type="text" /><button className="bubbly-button">Click me!</button>
        <button id="join">join</button>
      </div> */}
      <video id="local-video1" width="300px" muted playsInline></video>
      <video id="local-video" width="300px"  muted playsInline></video>
      <div id="button-area"></div>
      <div id="remote-media-area"></div>
      {matchedUserId && (
  <div>
    <Card
    style={{ top:'-50px',left:'100px',width: 500 }}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <HeartOutlined key="setting" onClick={handleLikeClick}/>,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
      title={profile.nickname}
      description={profile.comment} 
    />
  </Card>
  </div>
)}
    </div>
  );
  }
  export default Tutorial;