import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialog({openAlertDialog, handleCloseAlertDialog, title, content, handleConfirm, handleCancel}) {
  const {t} = useTranslation();
  return (
    <React.Fragment>
      <Dialog
        open={openAlertDialog}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleCloseAlertDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('cancel')}</Button>
          <Button onClick={handleConfirm}>{t('accept')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
