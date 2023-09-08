import {
  nowInSec,
  RemoteVideoStream,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from '@skyway-sdk/room';

import { appId, secret } from '../../../env';

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
export default function SkywayComponent() {
(async () => {
  const localVideo = document.getElementById('local-video') as HTMLVideoElement;
  const buttonArea = document.getElementById('button-area');
  const remoteMediaArea = document.getElementById('remote-media-area');
  const roomNameInput = document.getElementById(
    'room-name'
  ) as HTMLInputElement;
  const myId = document.getElementById('my-id');
  const joinButton = document.getElementById('join');

  const { audio, video } =
    await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream();
  video.attach(localVideo);
  await localVideo.play();
  if (joinButton) {
  joinButton.onclick = async () => {
    if (roomNameInput.value === '') return;

    const context = await SkyWayContext.Create(token);
    const room = await SkyWayRoom.FindOrCreate(context, {
      type: 'p2p',
      name: roomNameInput.value,
    });
    const me = await room.join();
   if (myId === null) return;
    myId.textContent = me.id;

    await me.publish(audio);
    await me.publish(video);

    const subscribeAndAttach = (publication) => {
      if (publication.publisher.id === me.id) return;

      const subscribeButton = document.createElement('button');
      subscribeButton.textContent = `${publication.publisher.id}: ${publication.contentType}`;
      if (buttonArea === null) return;
      buttonArea.appendChild(subscribeButton);

      subscribeButton.onclick = async () => {
        const { stream } = await me.subscribe<RemoteVideoStream>(
          publication.id
        );

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
        if (remoteMediaArea === null) return;
        remoteMediaArea.appendChild(newMedia);
        
      };
    };

    room.publications.forEach(subscribeAndAttach);
    room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
  };
}
})
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

