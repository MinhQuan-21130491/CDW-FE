// components/StatusModal.js
import React from 'react';
import StatusUserCard from '../components/StatusUserCard';
import { AiOutlineClose } from 'react-icons/ai';
import StatusViewer from './StatusViewer';
import { useSelector } from 'react-redux';
import { 
  Modal,
  Box,
  IconButton,
  Divider
} from '@mui/material';

export default function StatusModal({ open, onClose }) {
  const { user } = useSelector(state => state.auth);

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
          <Box pb={2}>
            <StatusUserCard user={user} isCreate={true}/>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255)' }} />
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {[1, 1, 1, 1].map((item, index) => (
              <StatusUserCard key={index} />
            ))}
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
          <StatusViewer />
        </Box>
      </Box>
    </Modal>
  );
}