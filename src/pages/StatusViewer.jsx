import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import ReactPlayer from 'react-player';
import { Alert, Menu, MenuItem, Snackbar, useStepContext } from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxResume } from "react-icons/rx";
import { IoPause } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getStoriesByUser, removeStory } from '../redux/story/action';
import { useTranslation } from 'react-i18next';

export default function StatusViewer({ stories, ownerStory}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [durations, setDurations] = useState([]);
    const [isPause, setIsPause] = useState(false);
    const [anchorElStory, setAnchorElStory] = useState(null);
    const storyCurrent = useRef(null);
    const openMenuRemove = Boolean(anchorElStory);
    const defaultDuration = 2000; // ms
    const intervalRef = useRef(null);
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {response, loading, error} = useSelector(state => state.story);
    const token = localStorage.getItem('token');
    const [isRemove, setIsRemove] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [clickRemove, setClickRemove] = useState(false);
    const [messageAlert, setMessageAlert] = useState();
    const{t} = useTranslation();
    console.log(currentIndex)
    // ✅ Xử lý duration
    const handleDuration = (duration) => {
        const isVideo = stories[currentIndex]?.type === 'video';
        const newDuration = isVideo ? duration * 1000 : defaultDuration;

        setDurations(prev => {
            const copy = [...prev];
            copy[currentIndex] = newDuration;
            return copy;
        });
    };

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0);
        }
        setProgress(0);
    };

    // ✅ Điều khiển tiến trình dựa vào duration và pause
    useEffect(() => {
        const duration = durations[currentIndex];
        storyCurrent.current = stories[currentIndex];
        if (duration === undefined || isPause) return;

        const step = 100 / (duration / 100); // mỗi 100ms tăng bao nhiêu %
        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev + step >= 100) {
                    clearInterval(intervalRef.current);
                    // Chỉ chuyển sang story tiếp theo khi video hoặc ảnh hoàn thành
                    handleNext();
                    return 0;
                }
                return prev + step;
            });
        }, 100);

        return () => clearInterval(intervalRef.current);
    }, [currentIndex, durations, isPause]);

    const handleClick = (event) => {
        setIsPause(true);
        setAnchorElStory(event.currentTarget);
    };
    const handleClose = () => {
        setIsPause(false);
        setAnchorElStory(null);
    };

    const handlePause = () => {
        setIsPause(false);
    }
    const handleResume = () => {
        setIsPause(true);
    }
    const handleRemoveStory = () => {
        dispatch(removeStory({token: token, storyId: storyCurrent.current?.id}))
        setClickRemove(true);
    }
    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
      };
    
    useEffect(() => {
        setCurrentIndex(0);
        setProgress(0);
        setDurations([]);
    }, [stories, ownerStory]);
    
    useEffect(() => {
        if(response?.status === 200 && clickRemove) {
             dispatch(getStoriesByUser({token: token, userId:user?.id}))
             setOpenSnackBar(true);
             setIsRemove(true);
             setClickRemove(false);
             setAnchorElStory(null);
             setMessageAlert(t('success_delete_story'));
        }else if(clickRemove){
             setOpenSnackBar(true);
             setIsRemove(true);
             setClickRemove(false);
             setAnchorElStory(null);
             setMessageAlert(t('error_delete_story'));
        }
    }, [response])
    return (
        <div className='flex justify-center items-center bg-[#0b141a] h-[85vh]'>
            <div className="relative h-[80vh] w-[45vh] flex justify-center items-center bg-black overflow-hidden">
                {stories.length > 0 && stories.length > currentIndex ? (
                    <>
                        <div className='absolute right-0 top-8'>
                            {user?.id == ownerStory && (
                            <>
                            <BsThreeDotsVertical 
                                id="basic-button"
                                aria-controls={openMenuRemove ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenuRemove ? 'true' : undefined}
                                onClick={handleClick}
                                className='cursor-pointer text-2xl text-white'
                            />                           
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorElStory}
                                open={openMenuRemove}
                                onClose={handleClose}
                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                            >
                                <MenuItem onClick = {handleRemoveStory}>Xóa story</MenuItem>
                            </Menu>
                            </>
                            )}
                            {isPause ? <RxResume onClick={handlePause} className='cursor-pointer text-xl text-white mt-2'/> :<IoPause onClick={handleResume} className='cursor-pointer text-2xl text-white mt-2 '   />
 }

                        </div>

                        {stories != undefined  && stories[currentIndex].type === 'video' ? (
                            <ReactPlayer
                                url={stories[currentIndex].url}
                                onDuration={handleDuration}
                                playing={!isPause}
                                muted={false}
                                controls={false}
                                width="100%"
                                height="auto"
                            />
                        ) : (
                            <img
                                src={stories[currentIndex].url}
                                alt=""
                                onLoad={() => handleDuration(null)}
                                className="h-full w-full object-contain"
                            />
                        )}

                        <div className="absolute top-0 flex w-full">
                            {stories.map((_, index) => (
                                <ProgressBar
                                    key={index}
                                    isActive={index === currentIndex}
                                    progress={index < currentIndex ? 100 : (index === currentIndex ? progress : 0)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className='text-white'>{t("no_story")}</p>
                )}
            </div>
            <Snackbar 
                    open={openSnackBar} 
                    autoHideDuration={6000} 
                    onClose={handleSnackBarClose}
                  >
                    <Alert onClose={handleSnackBarClose} severity={isRemove ? 'success' : 'error'} sx={{ width: '100%' }}>
                      {messageAlert}
                    </Alert>
            </Snackbar>
        </div>
    );
}
