//
// Copyright 2020 Wireline, Inc.
//

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Video from './Video';
import VideoHandler from './VideoHandler';
import VideoControls from './VideoControls';

const videoConstraints = {
  width: {
    ideal: 640
  },
  height: {
    ideal: 400
  },
  aspectRatio: { ideal: 1.7777777778 },
  frameRate: {
    ideal: 25
  }
};

const useStyles = makeStyles(() => ({
  videoCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  videos: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  gallery: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 10000,
    backgroundColor: 'black',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOverlay: {
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto auto 0 auto',
    position: 'absolute',
    width: 'fit-content',
    height: 'fit-content',
    zIndex: 10001,
    pointedEvents: 'none',
    cursor: 'default',
  },
}));

function isScreenSharingDeniedBySystem(error) {
  return error.message.includes('denied by system') || error.name === 'NotFoundError';
}

/**
 * The Videos component is responsible for displaying the incoming streams (with metadata)
 * and to distribute user's stream over the connections
 * @param {Array} connections
 * @param {Array} streamsWithMetaData
 */
const Videos = ({ connections, streamsWithMetaData }) => {
  const classes = useStyles();
  const [videoHandler] = useState(new VideoHandler());
  const [stream, setStream] = useState();

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [galleryViewEnabled, setGalleryViewEnabled] = useState(false);

  useEffect(() => {
    setImmediate(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoTracks = await stream.getVideoTracks();
      await Promise.all(videoTracks.map(videoTrack => videoTrack.applyConstraints(videoConstraints)));
      videoHandler.setStream(stream);
      setStream(stream);
    });
    return () => videoHandler.stop();
  }, [videoHandler]);

  useEffect(() => {
    videoHandler.setConnections(connections);
  }, [videoHandler, connections]);

  useEffect(() => {
    if (screenShareEnabled) {
      setImmediate(async () => {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia();
          stream.getVideoTracks().forEach(track => {
            track.addEventListener('ended', () => {
              setScreenShareEnabled(false);
              videoHandler.clearScreenShare();
            });
          });
          videoHandler.setScreenShare(stream);
        } catch (err) {
          console.error(err);
          if (isScreenSharingDeniedBySystem(err)) {
            // eslint-disable-next-line no-alert
            alert('Your system is preventing the browser from screen-sharing');
          }
          setScreenShareEnabled(false);
        }
      });
    } else {
      videoHandler.clearScreenShare();
    }
  }, [screenShareEnabled]);

  useEffect(() => {
    if (!stream) return;
    setImmediate(async () => {
      (await stream.getVideoTracks()).forEach(track => {
        track.enabled = cameraEnabled;
      });
      (await stream.getAudioTracks()).forEach(track => {
        track.enabled = audioEnabled;
      });
      videoHandler.setMetaData({ cameraEnabled, audioEnabled });
    });
  }, [stream, cameraEnabled, audioEnabled]);

  const videoControls = (
    <VideoControls
      audioEnabled={audioEnabled}
      onAudioEnabledChange={setAudioEnabled}
      cameraEnabled={cameraEnabled}
      onCameraEnabledChange={setCameraEnabled}
      screenShareEnabled={screenShareEnabled}
      onScreenShareEnabledChange={setScreenShareEnabled}
      galleryViewEnabled={galleryViewEnabled}
      onGalleryViewEnabledChange={setGalleryViewEnabled}
    />
  );

  if (galleryViewEnabled) {
    return (
      <>
        <div className={classes.gallery}>
          <Video
            self
            srcObject={stream}
            metaData={{ cameraEnabled, audioEnabled }}
          />
          {streamsWithMetaData.map(stream => (
            <Video
              srcObject={stream.mediaStream}
              metaData={stream.metaData}
            />
          ))}
        </div>
        <div className={classes.bottomOverlay}>{videoControls}</div>
      </>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.videos}>
        {stream && (
          <Video
            self
            srcObject={stream}
            metaData={{ cameraEnabled, audioEnabled }}
          />
        )}
        {streamsWithMetaData.map(stream => (
          <Video
            srcObject={stream.mediaStream}
            metaData={stream.metaData}
          />
        ))}
      </div>
      {videoControls}
    </div>
  );
};

export default Videos;
