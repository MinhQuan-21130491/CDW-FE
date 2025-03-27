import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from 'react-icons/bs'
import { TbCircleDashed } from 'react-icons/tb'
import ChatCard from '../components/ChatCard'
import { logo } from '../assets'
import { BiDotsVerticalRounded } from "react-icons/bi";
import MessageCard from '../components/MessageCard'
import { ImAttachment } from 'react-icons/im'
import Profile from '../components/Profile'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import CreateGroup from '../components/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser } from '../redux/auth/Action'

export default function HomePage() {
    const[search, setSearch] = useState();
    const[currentChat, setCurrentChat] = useState(false);
    const[content, setContent] = useState();
    const [isProfile, setIsProfile] = useState();
    const [isGroup, setIsGroup] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const {user} = useSelector(state => state.auth);
    const handleSearch = () => {
        
    }
    const handleSelectChatCard = () => {
        setCurrentChat(true);
    }
    const handleSendMessage =() => {

    }
    const handleNavigateProfile = (isShow) => {
        setIsProfile(isShow)
        setAnchorEl(null);
    }

    useEffect(() => {
        if(!token) {
            navigate('/signin')
        }else {
            dispatch(currentUser(token))
        }
    },[token])
    // logic xu ly 
    // const messagesWithAvatar = messages.map((message, index, arr) => {
        // const nextMessage = arr[index + 1];
    //     // Kiểm tra tin nhắn tiếp theo
    //     const isLastFromUser = index === arr.length - 1 || arr[index + 1].userId !== message.userId;
            // const isTimeExceeded = nextMessage && nextMessage.userId === message.userId
            // ? Math.abs(new Date(nextMessage.time) - new Date(message.time)) > 10 * 60 * 1000 // Cách nhau hơn 10 phút
            // : false;

    //     return {
    //       ...message,
    //       showAvatar: isLastFromUser || isTimeExceeded// Avatar chỉ hiện nếu là tin cuối từ user
    //     };
    //   });
    const messages = [
        { id: 1, userId: 'user1', text: 'Hello!', showAvatar: false },
        { id: 2, userId: 'user1', text: 'How are you?', showAvatar: false },
        { id: 3, userId: 'user1', text: 'What’s up?', showAvatar: true }, // Cuối cùng từ user1
        { id: 4, userId: 'user2', text: 'Hi!', showAvatar: true } // user2 chỉ gửi một tin
      ];
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateGroup = (isShow) => {
        setIsGroup(isShow)
        setAnchorEl(null);
    }

  return (
    <div className='relative h-screen bg-slate-300 '>
        <div className='w-full py-14 bg-primeColor '></div>
        <div className='flex bg-[#f0f2f5] h-[90vh] absolute top-9 left-10 right-10 z-50 shadow-md'>
            <div className='left md:w-[350px] sm:w-[100px] bg-white h-full flex flex-col' >
                {/* Profile */}
                {isProfile && (<div className='w-full h-full bg-[#f0f2f5]'><Profile handleNavigate = {handleNavigateProfile} /></div>)}
                {/* Create group */}
                {isGroup && (<CreateGroup handleNavigate = {handleCreateGroup} />)}
                {/* Home */}
                {!isProfile && !isGroup && (
                    <>
                      <div className='flex items-center justify-between p-3 bg-[#e8e9ec]'>
                        <div className='flex items-center space-x-3 overflow-hidden'
                            onClick={() => handleNavigateProfile(true)}
                        >
                            <img className='rounded-full w-10 h-10 object-cover cursor-pointer' src={user?.profile_picture || 'https://static.vecteezy.com/system/resources/thumbnails/024/646/930/small_2x/ai-generated-stray-cat-in-danger-background-animal-background-photo.jpg'}></img>
                            <p className='cursor-pointer text-lg '>{user?.full_name}</p>
                        </div>
                        <div className='space-x-2 text-2xl hidden md:flex'>
                            <TbCircleDashed onClick = {() => navigate("/status")} className='cursor-pointer'/>
                            <BiCommentDetail className='cursor-pointer'/>
                            <div>
                                <BsThreeDotsVertical 
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    className='cursor-pointer'
                                />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={() => handleNavigateProfile(true)}>Thông tin</MenuItem>
                                    <MenuItem onClick={() => handleCreateGroup(true)}>Tạo nhóm</MenuItem>
                                    <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
                                </Menu>
                            </div>
                        </div>
                      </div>
                        <div className='relative flex justify-center items-center bg-white py-4 px-3 space-x-2'>
                                <input 
                                    className='border-none outline-none bg-slate-200 rounded-md w-[93%] py-2 pl-9 pr-4'
                                    type='text'
                                    placeholder='Tìm kiếm bạn bè'
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        handleSearch(e.target.value)
                                    }}
                                    value = {search}
                                />
                                <AiOutlineSearch className='text-xl absolute left-3'/>
                                <div>
                                    <BsFilter className='text-2xl'/>
                                </div>
                        </div>
                        {/* Scrollable Chat List */}
                        <div className='flex-1 overflow-y-auto overflow-x-hidden'>
                                {search && [1,1,1,1,1,1,1,1,1,1].map((item) => <div onClick={handleSelectChatCard}><ChatCard/></div>)}
                        </div>
                    </>
                        )}
              
            </div>
            <div  className='right flex-1'>
                {/* Default page */}
                { !currentChat && <div className='flex flex-col h-full items-center justify-center'>
                    <div className='max-w-[70%] text-center '>
                        <img 
                        src={logo}
                        className='object-cover'
                        />
                        <h1 className='text-3xl text-gray-600'>WhatsApp Web</h1>
                    </div>
                </div>
                }  
                {/* Message part */}
                {currentChat &&
                    <div className='relative h-full' >
                        <div className='header absolute top-0 w-full bg-[#f0f2f5] z-50'>
                            <div className='flex items-center justify-between p-3'>
                                <div className='flex items-center space-x-3'>
                                    <img
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s'
                                    className='w-10 h-10 rounded-full object-cover'
                                    />
                                    <p>Chip</p>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <AiOutlineSearch className='text-xl '/>
                                    <BiDotsVerticalRounded className='text-xl '/>
                                </div>
                            </div>
                        </div>
                        {/* Message section */}
                        <div className='bg-blue-200 h-full overflow-y-scroll'>
                            <div className='py-20 pl-10 pr-4 space-y-2 flex flex-col justify-center border '>
                                {messages && messages.map((item, index) => <MessageCard key = {index} showAvatar = {item.showAvatar} isReceiUserMessage={item.userId === 'user1'} content = {item.text} />)}
                            </div>
                        </div>
                        {/* footer part */}
                        <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full flex justify-between items-center p-3 z-50'>
                            <div className='flex space-x-6'>
                                <BsEmojiSmile className='cursor-pointer text-2xl' />
                                <ImAttachment className='cursor-pointer text-2xl'/>
                            </div>
                            <input 
                                className='py-2 outline-none border-none bg-white pl-4 rounded-lg w-[85%]' 
                                type='text' 
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='Nhập tin nhắn...'
                                value={content}
                                onKeyPress={(e) => {
                                    if(e.key = "Enter") {
                                        handleSendMessage();
                                        setContent('');
                                    }
                                } }
                            />
                            <BsMicFill className='cursor-pointer text-2xl'/>
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}
