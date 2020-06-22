//
// Copyright 2020 DXOS.org
//

import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const useStyles = makeStyles(() => ({
  videoContainer: {
    position: 'relative'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  fullScreenVideo: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 10000,
    backgroundColor: 'black'
  },
  centeredUnderlay: {
    left: 0,
    right: 0,
    top: '50%',
    bottom: 0,
    margin: 'auto',
    position: 'absolute',
    width: 'fit-content',
    height: 'fit-content',
    zIndex: -1,
    color: 'white'
  },
  bottomOverlay: {
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto auto 0 auto',
    position: 'absolute',
    width: 'fit-content',
    height: 'fit-content',
    zIndex: 1,
    pointedEvents: 'none',
    cursor: 'default'
  },
  indicator: {
    display: 'inline-block',
    color: '#f50057',
    padding: '7px 5px 3px 5px',
    backgroundColor: 'white',
    borderRadius: 50,
    margin: 10
  },
  hiddenIndicator: {
    display: 'none'
  }
}));

const Video = ({ srcObject, metaData, self }) => {
  const classes = useStyles();
  const element = useRef(null);
  const isMuted = metaData && metaData.audioEnabled === false;
  const isHidden = metaData && metaData.cameraEnabled === false;

  const [isFullScreen, setFullScreen] = useState(false);

  /**
   * Autoplay strategy
   *
   * Some browsers (like Brave) require the video to be started
   * only after user's explicit interaction, overriding 'autoPlay' attribute
   *
   * The strategy for starting the video feeds is as follows:
   * 1. Use the 'autoPlay' attribute. This works in most cases
   * 2. Try to play the video in useEffect.
   *    This might not work when a new video appears (someone joins the call),
   *    because it happens automatically (no explicit user interaction)
   * 3. Play the video after user explicitly clicked on the video area prompted by the overlay
   */

  useEffect(() => {
    if (element.current) {
      // The 'video' tag cannot be used directly in React because we cannot set its srcObject attribute
      // See https://github.com/facebook/react/issues/11163 for more details
      element.current.srcObject = srcObject;
    }
    element.current.play().catch(console.error);
  }, [element.current]);

  const onClick = () => {
    if (element?.current?.paused) {
      element.current.play();
    } else {
      setFullScreen(isFullScreen => !isFullScreen);
    }
  };

  return (
    <div className={classes.videoContainer}>
      <div className={classes.centeredUnderlay}>Click here to play</div>
      <video
        autoPlay
        muted={self}
        onClick={onClick}
        ref={element}
        className={isFullScreen ? classes.fullScreenVideo : classes.video}
        style={self && { transform: 'scaleX(-1)' }}
      />
      <div className={classes.bottomOverlay}>
        <span className={isMuted ? classes.indicator : classes.hiddenIndicator}><MicOffIcon /></span>
        <span className={isHidden ? classes.indicator : classes.hiddenIndicator}><VideocamOffIcon /></span>
      </div>
    </div>
  );
};

Video.propTypes = {
  srcObject: PropTypes.object.isRequired
};

export default Video;
