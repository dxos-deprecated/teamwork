//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import RedeemIcon from '@material-ui/icons/Redeem';
import Alert from '@material-ui/lab/Alert';

import { useInvitationRedeemer } from '@dxos/react-client';

import DialogHeading from '../components/DialogHeading';
import { useSentry } from '../hooks';

const useStyles = makeStyles(theme => ({
  marginTop: {
    marginTop: theme.spacing(2)
  },
  title: {
    marginLeft: theme.spacing(2)
  }
}));

const RedeemDialog = ({ onClose, ...props }) => {
  const classes = useStyles();
  const [isOffline, setIsOffline] = useState(false);
  const sentry = useSentry();
  const [error, setError] = useState(undefined);
  const [step, setStep] = useState(0); // TODO(burdon): Const.
  const [invitationCode, setInvitationCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDone = () => {
    setStep(0);
    setInvitationCode('');
    setPinCode('');
    setIsProcessing(false);
    onClose();
  };

  const handleInvitationError = (error) => {
    setStep(2);
    if (error.includes('SyntaxError: Unexpected token') || error.includes('InvalidCharacterError')) {
      setError('Invalid invitation code.');
    } else if (error.includes('ERR_GREET_INVALID_INVITATION')) {
      setError('Invitation not authorized.');
    } else {
      setError(error);
    }
    if (sentry) {
      sentry.addBreadcrumb({ message: String(error) });
      sentry.captureMessage(`${isOffline ? 'Offline' : 'Online'} invitation redeem failed.`);
    }
  };

  const [redeemCode, setPin] = useInvitationRedeemer({
    onDone: () => {
      if (sentry) {
        sentry.captureMessage(`${isOffline ? 'Offline' : 'Online'} invitation redeemed.`);
      }
      handleDone();
    },
    onError: (ex) => handleInvitationError(String(ex)),
    isOffline
  });

  const handleEnterInvitationCode = async () => {
    if (isProcessing) {
      return;
    }
    redeemCode(invitationCode);
    setStep(1);
  };

  const handleEnterPinCode = async () => {
    setIsProcessing(true);
    setPin(pinCode);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnterInvitationCode();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open
      onClose={step === 0 ? handleDone : undefined} // No click away when in the middle of a flow
      {...props}
    >
      <DialogHeading title='Redeem Invitation' icon={RedeemIcon}/>

      {step === 0 && (
        <>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              multiline
              placeholder="Paste invitation code."
              spellCheck={false}
              value={invitationCode}
              onChange={(event) => setInvitationCode(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
            />
            <FormControlLabel
              className={classes.marginTop}
              control={<Checkbox checked={isOffline} onChange={event => setIsOffline(event.target.checked)}/>}
              label="Offline"
            />
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={handleDone}>Cancel</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleEnterInvitationCode}
              disabled={isProcessing}>
              Submit
            </Button>
          </DialogActions>
        </>
      )}

      {step === 1 && setPin && (
        <>
          <DialogContent>
            <Typography variant='body1' gutterBottom>
              Enter the PIN number.
            </Typography>
            <TextField
              value={pinCode}
              onChange={(event) => setPinCode(event.target.value)}
              variant='outlined'
              margin='normal'
              required
              fullWidth
              label='PIN Code'
              autoFocus
              disabled={isProcessing}
            />
            {isProcessing && <LinearProgress/>}
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={handleDone}>Cancel</Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleEnterPinCode}
              disabled={isProcessing}>
              Submit
            </Button>
          </DialogActions>
        </>
      )}

      {step === 1 && !setPin && (
        <DialogContent>
          <LinearProgress />
          <Typography className={classes.marginTop} variant='body1' gutterBottom>
            Processing...
          </Typography>
        </DialogContent>
      )}

      {step === 2 && error && (
        <DialogContent>
          <Alert severity="error">{error}</Alert>
          <DialogActions>
            <Button autoFocus color='secondary' onClick={handleDone}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default RedeemDialog;
