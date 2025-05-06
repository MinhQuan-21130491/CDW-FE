import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
 '& .MuiPaper-root': {
    backgroundColor: 'transparent', // xoá nền trắng
    boxShadow: 'none',              // bỏ đổ bóng nếu muốn
  },
  '& .MuiDialogContent-root': {
    padding: 0,                     // xoá padding
  },
}));

export default function ImageDialog({open, handleOnclose, img}) {
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleOnclose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <IconButton
          aria-label="close"
          onClick={handleOnclose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ padding: 0 }}>
          <img src={img}/>
        </DialogContent>

      </BootstrapDialog>
    </React.Fragment>
  );
}
