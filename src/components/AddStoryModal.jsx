import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import ReactPlayer from 'react-player';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addStory, getStoriesByUser } from '../redux/story/action';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '50vh',
  bgcolor: '#1e262c',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflowY: 'auto',
  borderRadius: '8px',
};

const PreviewContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginTop: '20px',
  marginBottom: '20px',
});

const PreviewItem = styled('div')({
  position: 'relative',
  width: '100%',
  maxHeight: '50vh',
  borderRadius: '8px',
  overflow: 'hidden',
});

const MediaWrapper = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '50vh',
  objectFit: 'contain',
});

const VideoWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
});

const LoadingOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(30, 38, 44, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  borderRadius: '8px',
});
const maxFileSize = 20 * 1024 * 1024; // 20MB

export default function AddStoryModal({ open, onClose, user }) {
  const [media, setMedia] = useState({ type: '', file: '', url: '' });
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const {response, error, loading } = useSelector(state => state.story);
  const [status, setStatus] = useState(false);
  const [addStr, setAddStr] = useState(false);
  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if(file.size > maxFileSize) {
        alert("Ảnh/video vượt quá 20MB");
        return;
      } 
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      const fileURL = URL.createObjectURL(file);
      setMedia({ type: fileType, file: file, url: fileURL });
    }
  };

  const handleUpload = () => {
    const data = {
      token: token,
      storyReq: {
        file: media.file,
        type: media.type,
        userId: user?.id,
      },
    };
    dispatch(addStory(data));
    setAddStr(true);
  };

  const handleRemove = () => {
    setMedia({ type: '', file: '', url: '' });
  };
  const handleOnclose = () => {
    onClose();
  }

  useEffect(() => {
    if (response?.status === 200 && addStr) {
      setStatus(true);
      setOpenSnackBar(true);
      handleOnclose();
      setMedia({ type: '', file: '', url: '' });
      setAddStr(false);
      dispatch(getStoriesByUser({token: token, userId:user?.id}))
    } else if (error) {
      setStatus(false);
      setOpenSnackBar(true);
    }
  }, [response, error]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleOnclose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading && (
            <LoadingOverlay>
              <CircularProgress color="white" />
            </LoadingOverlay>
          )}

          <Typography id="modal-modal-title" variant="h6" component="h2" color="white">
            Thêm hình ảnh/video vào story
          </Typography>

          {!media.url ? (
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" component="label">
                Chọn hình ảnh/video
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          ) : (
            <>
              <PreviewContainer>
                <PreviewItem>
                  <MediaWrapper>
                    {media.type === 'image' ? (
                      <ImagePreview src={media.url} alt="preview" />
                    ) : (
                      <VideoWrapper>
                        <ReactPlayer
                          url={media.url}
                          controls
                          width="100%"
                          style={{ objectFit: 'contain' }}
                          playing
                          muted={false}
                        />
                      </VideoWrapper>
                    )}
                  </MediaWrapper>
                </PreviewItem>
              </PreviewContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="error" onClick={handleRemove}>
                  Hủy bỏ
                </Button>
                <Button variant="contained" color="success" onClick={handleUpload}>
                  Đăng
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar 
        open={openSnackBar} 
        autoHideDuration={6000} 
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleSnackBarClose} severity={status ? 'success' : 'error'} sx={{ width: '100%' }}>
          {status ? 'Đăng story thành công!' : 'Đăng story thất bại!'}
        </Alert>
      </Snackbar>
    </div>
  );
}
