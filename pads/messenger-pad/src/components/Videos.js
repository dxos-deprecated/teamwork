//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import SourcesDialog from './SourcesDialog';
import Video from './Video';
import VideoControls from './VideoControls';
import VideoHandler from './VideoHandler';

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
    alignItems: 'center'
  },
  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  videos: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
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
    justifyContent: 'center'
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
    cursor: 'default'
  }
}));

function isScreenSharingDeniedBySystem (error) {
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
  const [showMediaSource, setShowMediaSource] = useState(false);

  const [mediaSourceAnchorEl, setMediaSourceAnchorEl] = useState(null);
  const [mediaSources, setMediaSources] = useState([]);
  const [mediaSource, setMediaSource] = useState({ video: null, audio: null });

  const changeAudioSource = (newSource) => {
    setMediaSource(old => {
      return { video: old.video, audio: newSource };
    });
  };

  const changeVideoSource = (newSource) => {
    setMediaSource(old => {
      return { video: newSource, audio: old.audio };
    });
  };

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); 
     
      const audioInputs = (await navigator.mediaDevices.enumerateDevices())
        .filter(device => device.kind === 'audioinput');
      const defaultAudio = audioInputs ? audioInputs[0].deviceId : true;

      const videoInputs = (await navigator.mediaDevices.enumerateDevices())
        .filter(device => device.kind === 'videoinput');
      const defaultVideo = videoInputs ? videoInputs[0].deviceId : true;

      setMediaSource({ audio: defaultAudio, video: defaultVideo });
    })();
  }, []);

  useEffect(() => {
    return () => videoHandler.stop();
  }, [videoHandler]);

  useEffect(() => {
    videoHandler.setConnections(connections);
  }, [videoHandler, connections]);

  useEffect(() => {
    const { audio, video } = mediaSource;
    if (!audio && !video) {
      return;
    }
    videoHandler.stop();
    setImmediate(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: video },
        audio: { deviceId: audio }
      });
      const videoTracks = await stream.getVideoTracks();
      await Promise.all(videoTracks.map(videoTrack => videoTrack.applyConstraints(videoConstraints)));
      videoHandler.setStream(stream);
      setStream(stream);
    });
  }, [mediaSource]);

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

  useEffect(() => {
    if (!showMediaSource) {
      return;
    }
    (async () => {
      setMediaSources(await navigator.mediaDevices.enumerateDevices());
    })();
  }, [showMediaSource]);

  const toggleShowMediaSource = (anchorEl) => {
    setShowMediaSource(showMediaSource => !showMediaSource);
    setMediaSourceAnchorEl(anchorEl);
  };

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
      showMediaSourceDialog={toggleShowMediaSource}
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
              key={stream.mediaStream.id}
              srcObject={stream.mediaStream}
              metaData={stream.metaData}
            />
          ))}
        </div>
        <SourcesDialog
          open={showMediaSource}
          onClose={() => setShowMediaSource(false)}
          mediaSources={mediaSources}
          setAudioSource={changeAudioSource}
          setVideoSource={changeVideoSource}
          audioSource={mediaSource.audio}
          videoSource={mediaSource.video}
          mediaSourceAnchorEl={mediaSourceAnchorEl}
          horizontalOrigin='center'>
        </SourcesDialog>

        {/* TODO(burdon): Comment? */}
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
            key={stream.mediaStream.id}
            srcObject={stream.mediaStream}
            metaData={stream.metaData}
          />
        ))}
      </div>
      <SourcesDialog
        open={showMediaSource}
        onClose={() => {
          setShowMediaSource(false);
          setMediaSourceAnchorEl(null);
        }}
        mediaSources={mediaSources}
        setAudioSource={changeAudioSource}
        setVideoSource={changeVideoSource}
        audioSource={mediaSource.audio}
        videoSource={mediaSource.video}
        mediaSourceAnchorEl={mediaSourceAnchorEl}
        horizontalOrigin='right'>
      </SourcesDialog>
      {videoControls}
    </div>
  );
};

export default Videos;
