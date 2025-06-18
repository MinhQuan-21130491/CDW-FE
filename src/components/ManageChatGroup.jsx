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
import { addUserToGroup, editGroup, removeUserFromGroup } from '../redux/chat/action';
import { searchUser } from '../redux/user/action';
import AlertDialog from './AlertDialog';
import { useTranslation } from 'react-i18next';

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

export default function GroupManagementModal({ open, handleClose, chat, token, stompClient, reloadUserInChat, userCurrent }) {
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
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState('');
  const { t } = useTranslation();

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

  const handleEditGroup = () => {
    const data = {
        token: token,
        chatReq: {
          chatId: chat?.id,
          newName: groupName || chat?.chat_name,
          groupAvatar: groupAvatar
        }
    }
    dispatch(editGroup(data));
    setClick(true);
  };

  const handleAddMember = (userId) => {
    const data = {
       token: token,
       chatId: chat?.id,
       userId: userId,
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
        if(message === "success_edit_group" && click) {
        setGroupName("");
        setIsDisable(true);
        stompClient.publish({
            destination: '/app/notification',
            body: JSON.stringify({
                name_request: "change group name",
                chatId: chat?.id,
                chat_name: groupName || chat?.chat_name,
                chat_image: chat?.chat_image
            }),
            headers: { 
                'content-type': 'application/json'
            }
        });
          setClick(false);   
          setIsShow(true);
          setOpenSnackBar(true);
          status.current = t('success_edit_group');
        }else if(message === "success_add_user" && click) {
           stompClient.publish({
            destination: '/app/broadcast-notification',
            body: JSON.stringify({
                 receiverIds: [id],
                 message: "You have been added to group",
                 chatId: chat?.id
              }),
            headers: { 
                'content-type': 'application/json'
            }
        });
          reloadUserInChat();  
          setIsShow(true);
          status.current =t('success_add_user');
          setOpenSnackBar(true);
          setClick(false);   
        }else if(message === "success_remove_user" && click) {
           stompClient.publish({
              destination: '/app/broadcast-notification',
              body: JSON.stringify({
                  receiverIds: [id],
                  message: "Remove user in group successfully",
                  chatId: chat?.id
                }),
              headers: { 
                  'content-type': 'application/json'
              }
            });
          reloadUserInChat();  
          setIsShow(true);
          status.current = t('success_remove_user');
          setOpenSnackBar(true);
          setClick(false);   
        }else if(message === "user_existed_in_group" && click) {
          status.current = t('user_existed_in_group');
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
      <DialogTitle>{t('manage_group')}</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 2 }}>
          <Tab label={t('edit_group')} />
          <Tab label={t('add_member')} />
          <Tab label={t('see_members')} />
        </Tabs>

        {/* Tab 1: Rename group */}
        {tabIndex === 0 && (
          <Box>
            {/* Chọn ảnh đại diện */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={groupAvatarPreview || chat?.chat_image}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Button variant="outlined" component="label">
                {t('pick_image')}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setGroupAvatar(file); // Lưu file ảnh
                      setGroupAvatarPreview(URL.createObjectURL(file)); // Hiển thị preview
                      setIsDisable(false); // Cho phép nút lưu
                    }
                  }}
                />
              </Button>
            </Box>

            {/* Nhập tên nhóm */}
            <TextField
              label={t('new_name_group')}
              fullWidth
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setIsDisable(false);
              }}
              sx={{ mb: 2 }}
            />

            {/* Nút lưu */}
            <Button disabled={isDisable} variant="contained" onClick={handleEditGroup}>
              {t("save")}
            </Button>
          </Box>
        )}


        {/* Tab 2: Add member */}
        {tabIndex === 1 && (
          <Box>
            <TextField
              label={t('search')}
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
                      user.id !== userCurrent.id && (
                        <IconButton onClick={() => handleOpenAlertDialog(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )
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
                     title ={t('confirm')} 
                     content = {t('message_confirm')}  
                     handleConfirm = {() => handleRemoveMember(userId)} 
                     handleCancel = {handleCloseAlertDialog}
                     />     
    </Dialog>
  );
}
