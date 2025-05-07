// components/StatusModal.js
import React, { useEffect, useState } from 'react';
import StatusUserCard from '../components/StatusUserCard';
import { AiOutlineClose } from 'react-icons/ai';
import StatusViewer from './StatusViewer';
import { 
  Modal,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';

export default function StatusModal({ open, onClose}) {
  const {user} = useSelector((state) => state.auth);
  const {users} = useSelector((state) => state.user);
  const [stories, setStories] = useState([]);
  const [ownerStory, setOwnerStory] = useState([]);
  const handleViewStories = (stories, ownerStory) => {
    setStories(stories);
    setOwnerStory(ownerStory)
  }
  useEffect(() => {
    if (user?.stories) {
      setStories(user.stories);
      setOwnerStory(user?.id);
    }
  }, [user?.stories, open]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="status-modal"
      aria-describedby="view-status-updates"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBox-root': { // Target Box component inside Modal
          border: 'none' // Bỏ border
        }
      }}
    >
      <Box
        sx={{
          width: '90%',
          height: '85vh',
          maxWidth: '1200px',
          bgcolor: '#f0f2f5',
          boxShadow: 24,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left side - User list */}
        <Box
          sx={{
            width: { xs: '100px', md: '250px' },
            bgcolor: '#1e262c',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            px: 1,
            overflow: 'hidden',
          }}
        >
          <Box pb={2} onClick = {() => handleViewStories(user?.stories, user?.id)}>
            <StatusUserCard user={user} isCreate={true}/>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255)' }} />
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {users?.map((item, index) => {
              if(item?.id == user?.id) return;
              return (
              <Box onClick = {() => handleViewStories(item?.stories, item?.id)}>
                <StatusUserCard key={index} user ={item}  />
              </Box>
              )})}
          </Box>
        </Box>

        {/* Right side - Status viewer */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#0b141a',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 1,
            }}
          >
            <AiOutlineClose fontSize="large" />
          </IconButton>
          <StatusViewer stories={stories} ownerStory = {ownerStory} />
        </Box>
      </Box>
    </Modal>
  );
}