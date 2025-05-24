import React, { useEffect, useRef, useState } from 'react';
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
  Alert,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToGroup, removeUserFromGroup, renameGroup } from '../redux/chat/action';
import { searchUser } from '../redux/user/action';
import AlertDialog from './AlertDialog';

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

export default function GroupManagementModal({ open, handleClose, chat, token, chat_image, stompClient, reloadUserInChat }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const {message, loading} = useSelector(state => state.chat);
  const [click, setClick] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const {users, error } = useSelector(state => state.user);
  const [usersInSearch, setUsersInSearch] = useState();
  const [usersInGroup, setUsersInGroup] = useState();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);  
  const [userId, setUserId] = useState();
  const handleOpenAlertDialog = (userId) => {
        setUserId(userId);
        setOpenAlertDialog(true);
  }
  const handleCloseAlertDialog = () => {
        setOpenAlertDialog(false);
  }
  const status = useRef("");
  const [id, setId] = useState();
  const dispatch = useDispatch();

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };

  const handleRename = () => {
    const data = {
        token: token,
        chatId: chat?.id,
        newName: groupName,
    }
    dispatch(renameGroup(data));
    setClick(true);
  };

  const handleAddMember = (userId) => {
    const data = {
       token: token,
       chatId: chat?.id,
       userId: 100,
    }
    setId(userId);
    dispatch(addUserToGroup(data));
    setClick(true);
  };
  const handleSearch = (keyword) => {
          const data = {
              token: token,
              query: keyword
          }
      dispatch(searchUser(data));  // Gọi action tìm kiếm người dùng
  }
  const handleRemoveMember = (userId) => {
    const data = {
       token: token,
       chatId: chat?.id,
       userId: userId,
    }
    dispatch(removeUserFromGroup(data));
    setId(userId);
    setClick(true);
    handleCloseAlertDialog();
  };

  useEffect(() => {
        if(message === "Rename group successfully" && click) {
        stompClient.publish({
            destination: '/app/notification',
            body: JSON.stringify({
                name_request: "change group name",
                chatId: chat?.id,
                chat_name: groupName,
                chat_image: chat_image
            }),
            headers: { 
                'content-type': 'application/json'
            }
        });
          setClick(false);   
          setIsShow(true);
          setOpenSnackBar(true);
          setIsDisable(true);
          // setStatus("Thay đổi tên nhóm thành công")
          status.current = "Thay đổi tên nhóm thành công";
        }else if(message === "Add user to group success" && click) {
           stompClient.publish({
            destination: '/app/broadcast-notification',
            body: JSON.stringify({
                 id: id,
                 message: "Add user to group success"
              }),
            headers: { 
                'content-type': 'application/json'
            }
        });
          reloadUserInChat();  
          setIsShow(true);
          status.current = "Thêm thành viên thành công";
          setOpenSnackBar(true);
          setClick(false);   
        }else if(message === "Remove user in group successfully" && click) {
           stompClient.publish({
              destination: '/app/broadcast-notification',
              body: JSON.stringify({
                  id: id,
                  message: "Remove user in group successfully"
                }),
              headers: { 
                  'content-type': 'application/json'
              }
            });
          reloadUserInChat();  
          setIsShow(true);
          status.current = "Xóa thành viên thành công";
          setOpenSnackBar(true);
          setClick(false);   
        }else if(message === "User already in group" && click) {
          status.current = "Thành viên đã tồn tại trong nhóm của bạn";
          setOpenSnackBar(true);
          setClick(false);   
          reloadUserInChat();  
        }
  }, [message, click])

  useEffect(() => {
    if(users && chat) {
        const temp = chat?.userChat?.map((u) => {return u?.user?.id});
        const usersTemp = users.filter((user) => {
          return !temp?.includes(user?.id);
        })
        setUsersInSearch(usersTemp);
    }
  }, [users, chat])

  useEffect(() => {
    const usersInGroup = chat?.userChat?.map((u) => {return u?.user});
    setUsersInGroup(usersInGroup);
  }, [chat, users])
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
          <Tab label="Xem thành viên" />
        </Tabs>

        {/* Tab 1: Rename group */}
        {tabIndex === 0 && (
          <Box>
            <TextField
              label= "Tên nhóm mới"
              fullWidth
              value={groupName}
              onChange={(e) => {setGroupName(e.target.value) 
                               setIsDisable(false)}}
              sx={{ mb: 2 }}
            />
            <Button disabled = {isDisable} variant="contained" onClick={handleRename}>Lưu</Button>
          </Box>
        )}

        {/* Tab 2: Add member */}
        {tabIndex === 1 && (
          <Box>
            <TextField
              label="Tìm kiếm người dùng"
              fullWidth
              value={searchTerm}
              onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
              }}
              sx={{ mb: 2 }}
            />
            <List>
              {usersInSearch?.map((user, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton onClick={() => handleAddMember(user.id)}>
                      <PersonAddIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt="Avatar" src={user?.profile_picture} />
                  </ListItemAvatar>
                  <ListItemText primary={user?.full_name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Tab 3: Remove member */}
        {tabIndex === 2 && (
          <Box>
            <List>
              {usersInGroup.map((user, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton onClick={() => handleOpenAlertDialog(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt="Avatar" src={user?.profile_picture} />
                  </ListItemAvatar>
                  <ListItemText primary={user?.full_name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <Snackbar
        open={openSnackBar} 
        autoHideDuration={3000} 
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={status.current ? 'success' : 'error'} sx={{ width: '100%' }}>
          {isShow ? status.current : 'Đã xảy ra lỗi'}
        </Alert>
      </Snackbar>
        <AlertDialog openAlertDialog ={openAlertDialog} 
                     handleCloseAlertDialog = {handleCloseAlertDialog} 
                     title = "Xác nhận xóa thành viên" 
                     content = "Bạn có chắc chắn muốn xóa thành viên này không?"  
                     handleConfirm = {() => handleRemoveMember(userId)} 
                     handleCancel = {handleCloseAlertDialog}/>     
    </Dialog>
  );
}
