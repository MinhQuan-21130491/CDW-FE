import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export const ViewMember = ({openViewMember, handleCloseViewMember, usersInGroup}) => {
  return (
    <>
      <BootstrapDialog
        onClose={handleCloseViewMember}
        aria-labelledby="customized-dialog-title"
        open={openViewMember}
      >
        <Typography sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Thành viên ({usersInGroup?.length})
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleCloseViewMember}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ width: 350, maxHeight: 400 }}>
           <Box>
            <List>
              {usersInGroup?.map((user, index) => (
                <ListItem
                  key={index}
                >
                  <ListItemAvatar>
                    <Avatar alt="Avatar" src={user?.profile_picture} />
                  </ListItemAvatar>
                  <ListItemText primary={user?.full_name} />
                </ListItem> 
              ))}
            </List>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
