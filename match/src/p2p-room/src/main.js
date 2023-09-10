import React, { useEffect, useRef } from 'react';
import {
  nowInSec,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from '@skyway-sdk/room';
import { appId, secret } from '../../p2p-room/src/env';

function P2p() {
  const localVideoRef = useRef(null);
  const buttonAreaRef = useRef(null);
  const remoteMediaAreaRef = useRef(null);
  const roomNameInputRef = useRef(null);
  const myIdRef = useRef(null);
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
  async function setupSkyway() {
    try {
        console.log('setupSkyway');

        const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
        video.attach(localVideoRef.current);
        await localVideoRef.current.play();
        console.log('setupSkyway3');

        // Use ref for joinButton instead of getElementById
        const joinButton = document.getElementById('join'); // You could convert this to useRef as well if you'd like.

        joinButton.onclick = async () => {
            if (roomNameInputRef.current && roomNameInputRef.current.value === '') return;

            const context = await SkyWayContext.Create(token);
            const room = await SkyWayRoom.FindOrCreate(context, {
                type: 'p2p',
                name: roomNameInputRef.current.value,
            });
            const me = await room.join();

            if (myIdRef.current) {
                myIdRef.current.textContent = me.id;
            }

            await me.publish(audio);
            await me.publish(video);

            const subscribeAndAttach = (publication) => {
                if (publication.publisher.id === me.id) return;

                const subscribeButton = document.createElement('button');
                subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
                if (buttonAreaRef.current) {
                    buttonAreaRef.current.appendChild(subscribeButton);
                }

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
                    if (remoteMediaAreaRef.current) {
                        remoteMediaAreaRef.current.appendChild(newMedia);
                    }
                };
            };

            room.publications.forEach(subscribeAndAttach);
            room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
        };
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

  useEffect(() => {
    setupSkyway();
  }, []); 

  return (
    <div>
      <p>ID: <span ref={myIdRef}></span></p>
      <div>
        room name: <input ref={roomNameInputRef} type="text" />
        <button id="join">join</button>
      </div>
      <video ref={localVideoRef} width="400px" muted playsInline></video>
      <div ref={buttonAreaRef}></div>
      <div ref={remoteMediaAreaRef}></div>
    </div>
  );
}

export default P2p;