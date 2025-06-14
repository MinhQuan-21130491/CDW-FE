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

export default function StatusModal({ open, onClose, onlineUsers }) {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const [stories, setStories] = useState([]);
  const [ownerStory, setOwnerStory] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleViewStories = (stories, ownerId) => {
    setStories(stories);
    setOwnerStory(ownerId);
    setSelectedUserId(ownerId);
  };

  useEffect(() => {
    if (user?.stories) {
      setStories(user.stories);
      setOwnerStory(user?.id);
      setSelectedUserId(user?.id);
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
        '& .MuiBox-root': {
          border: 'none'
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
            overflow: 'hidden',
          }}
        >
          {/* Current user */}
          <Box
            pb={0.5}
            onClick={() => handleViewStories(user?.stories, user?.id)}
            sx={{
              border: '2px solid',
              borderColor: selectedUserId === user?.id ? '#00bfa5' : 'transparent',
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
            
            }}
          >
            <StatusUserCard user={user} isCreate={true} isOnline={true} />
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255)' }} />

          {/* Other users */}
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {users && users.map((item, index) => {
              if (item?.id === user?.id) return null;

              const isSelected = selectedUserId === item?.id;

              return (
                <Box
                  key={index}
                  onClick={() => handleViewStories(item?.stories, item?.id)}
                  sx={{
                    border: '2px solid',
                    borderColor: isSelected ? 'red' : 'transparent',
                    borderRadius: 2,
                    paddingBottom: 1,
                    transition: 'all 0.3s',
                    backgroundColor: isSelected ? 'rgba(200, 200, 200, 0.2)' : 'transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#00bfa5',
                      backgroundColor: 'rgba(200, 200, 200, 0.2)',
                    },
                  }}
                >
                  <StatusUserCard user={item} isOnline={onlineUsers.includes(item.id)} />
                </Box>
              );
            })}
            <Box sx={{ paddingBottom: 1 }} />
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
          <StatusViewer stories={stories} ownerStory={ownerStory} />
        </Box>
      </Box>
    </Modal>
  );
}
