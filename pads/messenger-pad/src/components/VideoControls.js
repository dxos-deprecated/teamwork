//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles(() => ({
  controls: {
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    padding: 10,
    '& > *': {
      boxShadow: 'none !important'
    }
  }
}));

const VideoControls = ({
  audioEnabled,
  onAudioEnabledChange,
  cameraEnabled,
  onCameraEnabledChange,
  screenShareEnabled,
  onScreenShareEnabledChange,
  galleryViewEnabled,
  onGalleryViewEnabledChange,
  showMediaSourceDialog
}) => {
  const classes = useStyles();

  return (
    <div className={classes.controls}>
      <Fab
        color={audioEnabled ? 'default' : 'secondary'}
        onClick={() => onAudioEnabledChange(!audioEnabled)}
      >
        {audioEnabled ? <MicIcon /> : <MicOffIcon />}
      </Fab>
      <Fab
        color={cameraEnabled ? 'default' : 'secondary'}
        onClick={() => onCameraEnabledChange(!cameraEnabled)}
      >
        {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
      </Fab>
      <Fab
        color={screenShareEnabled ? 'secondary' : 'default'}
        onClick={() => onScreenShareEnabledChange(!screenShareEnabled)}
      >
        {screenShareEnabled ? <ScreenShareIcon /> : <StopScreenShareIcon />}
      </Fab>
      <Fab
        color={galleryViewEnabled ? 'secondary' : 'default'}
        onClick={() => onGalleryViewEnabledChange(!galleryViewEnabled)}
      >
        {galleryViewEnabled ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Fab>
      <Fab
        color='default'
        onClick={(event) => showMediaSourceDialog(event.target)}
      >
        <SettingsInputComponentIcon />
      </Fab>
    </div>
  );
};

export default VideoControls;
