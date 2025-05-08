import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  styled,
  Snackbar,
  Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { renameGroup } from '../redux/chat/action';

const LoadingOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#D3D3D3',
  opacity: 0.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  borderRadius: '2px',
});

export default function GroupManagementModal({ open, handleClose, chatId, token, groupNameCurrent, chat_image, stompClient }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const {message, loading} = useSelector(state => state.chat);
  const [click, setClick] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };
  const dummyUsers = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
    { id: 4, name: 'Phạm Thị D' }
  ];

  const handleRename = () => {
    const data = {
        token: token,
        chatId: chatId,
        newName: groupName,
    }
    dispatch(renameGroup(data));
    setClick(true);
  };

  const handleAddMember = (user) => {
    console.log('Thêm thành viên:', user);
  };

  const handleRemoveMember = (user) => {
    console.log('Xóa thành viên:', user);
  };

  const filteredUsers = dummyUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setGroupName(groupNameCurrent);
  }, [groupNameCurrent]);

  useEffect(() => {
        if(message === "Rename group successfully" && click) {
          stompClient.send("/app/notification", {"content-type": "application/json"}, JSON.stringify({name_request: "change group name", chatId: chatId, chat_name: groupName, chat_image: chat_image}));
          setClick(false);   
          setStatus(true);
          setOpenSnackBar(true);
        }
  }, [message, click])
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {loading && (
        <LoadingOverlay>
        <CircularProgress color="white" />
        </LoadingOverlay>
      )}
      <DialogTitle>Quản lý nhóm</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 2 }}>
          <Tab label="Đổi tên nhóm" />
          <Tab label="Thêm thành viên" />
          <Tab label="Xóa thành viên" />
        </Tabs>

        {/* Tab 1: Rename group */}
        {tabIndex === 0 && (
          <Box>
            <TextField
              label= "Tên nhóm mới"
              fullWidth
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button disabled = {groupNameCurrent === groupName ? true :false} variant="contained" onClick={handleRename}>Lưu</Button>
          </Box>
        )}

        {/* Tab 2: Add member */}
        {tabIndex === 1 && (
          <Box>
            <TextField
              label="Tìm kiếm người dùng"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List>
              {filteredUsers.map(user => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton onClick={() => handleAddMember(user)}>
                      <PersonAddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Tab 3: Remove member */}
        {tabIndex === 2 && (
          <Box>
            <List>
              {dummyUsers.map(user => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <IconButton onClick={() => handleRemoveMember(user)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <Snackbar 
              open={openSnackBar} 
              autoHideDuration={6000} 
              onClose={handleSnackBarClose}
            >
              <Alert onClose={handleSnackBarClose} severity={status ? 'success' : 'error'} sx={{ width: '100%' }}>
                {status ? 'Thay đổi tên nhóm thành công!' : 'Thay đổi tên nhóm thất bại!'}
              </Alert>
      </Snackbar>
    </Dialog>
  );
}
