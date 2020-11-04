//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { List, ListItem, ListItemText, Popover, Divider } from '@material-ui/core';

const SourcesDialog = ({
  setAudioSource,
  setVideoSource,
  open,
  onClose,
  mediaSources,
  audioSource,
  videoSource,
  mediaSourceAnchorEl,
  horizontalOrigin
}) => {
  return (
    <Popover
        open={open}
        onClose={onClose}
        anchorEl={mediaSourceAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: horizontalOrigin
        }}
      >
        <List>
            <ListItem>
              <ListItemText primary="Audio source: "></ListItemText>
            </ListItem>
            {
              mediaSources
                .filter(device => device.kind === 'audioinput')
                .map(device => (
                <ListItem
                  key={device.deviceId + device.label}
                  selected={audioSource === device.deviceId}
                  button={true}
                  onClick={() => setAudioSource(device.deviceId)}>
                  <ListItemText primary={device.label}></ListItemText>
                </ListItem>
              ))
            }
            <Divider />
            <ListItem>
              <ListItemText primary="Video source: "></ListItemText>
            </ListItem>
            {
              mediaSources
                .filter(device => device.kind === 'videoinput')
                .map(device => (
                <ListItem
                  key={device.deviceId + device.label}
                  selected={videoSource === device.deviceId}
                  button={true}
                  onClick={() => setVideoSource(device.deviceId)}>
                  <ListItemText primary={device.label}></ListItemText>
                </ListItem>
              ))
            }
        </List>
      </Popover>
  );
};

export default SourcesDialog;
