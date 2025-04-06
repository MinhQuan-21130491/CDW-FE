import React, { useEffect, useRef, useState } from 'react'
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
import { searchUser } from '../redux/user/action'
import UserCard from '../components/UserCard'
import { sendMessage } from '../redux/message/action'
import { getAllChat, getSingleChat } from '../redux/chat/action'

export default function HomePage() {
    const[search, setSearch] = useState('');
    const[currentChat, setCurrentChat] = useState(false);
    const[content, setContent] = useState('');
    const [isProfile, setIsProfile] = useState();
    const [isGroup, setIsGroup] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const { users, error, loading } = useSelector(state => state.user);
    const { response:message, error: errorMsg, loading: loadingMsg } = useSelector(state => state.message);
    const { chat, error: errorChat, loading: loadingChat } = useSelector(state => state.chat);
    const { chats, error: errorChats, loading: loadingChats } = useSelector(state => state.chat);
    const [userChatWith, setUserChatWith] = useState();
    const [messageData, setMessageData] = useState({userChat:'', userMessages:''});
    const token = localStorage.getItem('token')
    const handleSearch = (keyword) => {
        const data = {
            token: token,
            query: keyword
        }
        dispatch(searchUser(data));  // Gọi action tìm kiếm người dùng
    }
    const handleSelectChatCard = (user) => {
        setCurrentChat(true);
        setUserChatWith(user)
        const chatData = {
            token: token,
            id :user.id
        } 
        dispatch(getSingleChat(chatData))
    }
    const handleSendMessage =() => {
        const data = {
            token: token,
            messageReq: {
                content: content,
                receiverId: userChatWith.id,
            }
        }
        dispatch(sendMessage(data))
    }
    const handleNavigateProfile = (isShow) => {
        setIsProfile(isShow)
        setAnchorEl(null);
    }
   
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin')
    };
    const handleCreateGroup = (isShow) => {
        setIsGroup(isShow)
        setAnchorEl(null);
    };
    const handleUserUpdate = () => {
        dispatch(currentUser(token));
    };
    useEffect(() => {
        dispatch(currentUser(token));
    }, [])
    useEffect(() => {
        if(user) {
            dispatch(getAllChat({token: token, userId: user?.id}))
        }
    }, [user, message])
    useEffect(() => {
        // console.log("goi lai ham set")
        if(chat) {
            console.log(chat?.userMessages)
            const messagesWithAvatar = chat?.userMessages?.map((message, index, arr) => {
                const nextMessage = arr[index + 1];
                const isSameUser = nextMessage?.senderUser?.id === message.senderUser?.id;
              
                const isLastFromUser = !isSameUser;
              
                const isTimeExceeded =
                  isSameUser &&
                  Math.abs(new Date(nextMessage?.message?.timestamp).getTime() - new Date(message?.message?.timestamp).getTime()) > 10 * 60 * 1000;
              
                return {
                  ...message,
                  showAvatar: isLastFromUser || isTimeExceeded,
                };
              });
            setMessageData({ userChat: chat?.userChat, userMessages: messagesWithAvatar,})
        }else {
            setMessageData({ userChat: '', userMessages:''})

        }
    }, [chat, message])
    useEffect(() => {
        if(message && message?.status == 200) {
            const chatData = {
                token: token,
                id :userChatWith.id
            }
            dispatch(getSingleChat(chatData))
        }
    }, [message])

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageData.userMessages]);
  return (
    <div className='relative h-screen bg-slate-300 '>
        <div className='w-full py-14 bg-primeColor '></div>
        <div className='flex bg-[#f0f2f5] h-[90vh] absolute top-9 left-10 right-10 z-50 shadow-md'>
            <div className='left md:w-[350px] sm:w-[100px] bg-white h-full flex flex-col' >
                {/* Profile */}
                {isProfile && (<div className='w-full h-full bg-[#f0f2f5]'><Profile handleNavigate = {handleNavigateProfile}  user={user} onUpdateUser={handleUserUpdate}/></div>)}
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
                                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
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
                        {loading ? (
                                <p>Loading...</p>
                            ) : users?.length> 0 ? (
                                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                   {search != '' ? (
                                        users.map((item) => (
                                        <div key={item.id} onClick={() => handleSelectChatCard(item)}>
                                            <ChatCard user={item} isHide={true} />
                                        </div>
                                        ))
                                    ) : (
                                        chats && chats.map((chat, index) => {
                                            const otherUser = chat.userChat.find(
                                                (uc) => uc.user.id !== chat.createdBy.id
                                              )?.user;  
                                        return (
                                        <div key={index} onClick={() => handleSelectChatCard(otherUser)}>
                                            <ChatCard user={otherUser} isHide={false} time = {chat?.userMessages?.[chat?.userMessages?.length - 1]?.message?.timestamp} messageLast = {chat?.userMessages?.[chat?.userMessages?.length - 1].message.content} />
                                        </div>
                                        )})
                                    )}
                                </div>
                            ) : search != '' ? (
                                <div className='flex justify-center mt-5'>
                                    <p className='text-sm text-gray-500'>Không có bạn bè phù hợp</p>
                                </div>
                                ): (chats && chats.map((chat, index) => {
                                    const otherUser = chat.userChat.find(
                                        (uc) => uc.user.id !== chat.createdBy.id
                                      )?.user;  
                                return (
                                <div key={index} onClick={() => handleSelectChatCard(otherUser)}>
                                    <ChatCard user={otherUser} isHide={false} time = {chat?.userMessages?.[chat?.userMessages?.length - 1]?.message?.timestamp} messageLast = {chat?.userMessages?.[chat?.userMessages?.length - 1].message.content} />
                                </div>
                                )}))}
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
                        <h1 className='text-2xl text-gray-600'>Trò chuyện trực tuyến mọi lúc, mọi nơi.</h1>
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
                                    src={userChatWith?.profile_picture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s'}
                                    className='w-10 h-10 rounded-full object-cover'
                                    />
                                    <p>{userChatWith?.full_name || 'Chip'}</p>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <AiOutlineSearch className='text-xl '/>
                                    <BiDotsVerticalRounded className='text-xl '/>
                                </div>
                            </div>
                        </div>
                        {/* Message section */}
                        <div className='bg-blue-200 h-full overflow-y-scroll'>
                            <div className='py-20 pl-10 pr-4 space-y-2 flex flex-col justify-center '>
                                {messageData.userMessages && messageData.userMessages.map((item, index) => (
                                <MessageCard
                                    key={index}
                                    showAvatar={item.showAvatar}
                                    isReceiUserMessage={item?.senderUser?.id !== user.id}
                                    content={item.message.content}
                                    time={item.message.timestamp}
                                    avatar={item?.senderUser?.profile_picture}
                                />
                                ))}
                                {/* Phần tử đánh dấu cuối danh sách */}
                                <div ref={bottomRef}></div>
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
                                    if(e.key == "Enter") {
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
