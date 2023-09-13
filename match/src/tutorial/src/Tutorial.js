import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from '@skyway-sdk/room';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { appId, secret } from '../../p2p-room/src/env';
import { useEffect } from 'react';
import './index.css';
import axios from 'axios';

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const userId = user.uid;

    const eventSource = new EventSource(`http://localhost:5000/events?userId=${userId}`);

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Received random number:', data.randomNum);
        const roomNameInput = document.getElementById('room-name');
            roomNameInput.value = data.randomNum.toString(); // 数値の場合、文字列に変換

    };

    eventSource.onerror = function(error) {
        console.error('EventSource failed:', error);
        eventSource.close();
    };

  } else {
    // User is signed out
    // ...
  }
});

function Tutorial(room12) {

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
      roomNameInput.value = room12;
      console.log(roomNameInput.value)
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
      <p>ID: <span id="my-id"></span></p>
      <div>
        room name: <input id="room-name" type="text" />
        <button id="join">join</button>
      </div>
      <video id="local-video" width="400px" muted playsInline></video>
      <video id="local-video" width="300px"  muted playsInline></video>
      <div id="button-area"></div>
      <div id="remote-media-area"></div>
    </div>
  );
  }
  export default Tutorial;