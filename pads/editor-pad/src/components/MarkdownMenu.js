//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

function MarkdownMenu ({ onDownload, onPreviewOpen }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick (event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose () {
    setAnchorEl(null);
  }

  function handleDownload () {
    handleClose();
    onDownload();
  }

  function handlePreviewOpen () {
    handleClose();
    onPreviewOpen();
  }

  return (
    <>
      <Button
        aria-controls="markdown-menu"
        aria-haspopup="true"
        title='Markdown options'
        onClick={handleClick}
      >
        Markdown
      </Button>
      <Menu
        id="markdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handlePreviewOpen}>Toggle preview</MenuItem>
      </Menu>
    </>
  );
}

export default MarkdownMenu;
