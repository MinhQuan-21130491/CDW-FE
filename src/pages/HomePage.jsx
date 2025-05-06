import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from 'react-icons/bs'
import { TbCircleDashed } from 'react-icons/tb'
import ChatCard from '../components/ChatCard'
import { logo } from '../assets'
import { BiDotsVerticalRounded } from "react-icons/bi";
import MessageCard from '../components/MessageCard'
import { IoIosClose } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import Profile from '../components/Profile'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import CreateGroup from '../components/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser } from '../redux/auth/Action'
import { getAllUser, searchUser } from '../redux/user/action'
import UserCard from '../components/UserCard'
import { sendMessage, sendMessageGroup } from '../redux/message/action'
import { getAllChat, getChatById, getSingleChat } from '../redux/chat/action'
import EmojiPicker from "emoji-picker-react";
import SockJS from 'sockjs-client/dist/sockjs'
import {over} from 'stompjs'
import StatusModal from './StatusModal'

export default function HomePage() {
    const[search, setSearch] = useState('');
    const[currentChat, setCurrentChat] = useState({show: false, chatId: ''});
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
    const [showEmoji, setShowEmoji] = useState(false)
    const [selectedImage, setSelectedImage] = useState(false);
    const [images, setImages] = useState([]);
    const [stompClient, setStompClient] = useState();
    const [isConnect, setIsConnect] = useState(false);
    const [isSelectUserSearch, setIsSelectUserSearch] = useState(false);
    const [isOpenChatFirst, setIsOpenChatFirst] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const handleOpenStatusModal = () => {
        setStatusModalOpen(true);
      };
    
      const handleCloseStatusModal = () => {
        setStatusModalOpen(false);
      };

    //websocket
    // xử lý render lại UI list chat
    function onReceiNewMessage(payload) {
        const noti = payload.body;
        if(noti === 'New message') {
            dispatch(getAllChat({token: token, userId: user?.id}))
        }
    }

    const connect =() => {
        const sock = new SockJS("http://192.168.1.6:5454/ws");
        const temp = over(sock);
       

        const headers = {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
        }
        temp.connect(
            headers,
            () => {
                console.log("✅ Connected!");
                onConnect();
                temp?.subscribe("/topic/notification/", onReceiNewMessage)
            },
            (error) => {
                console.error("❌ Connection error:", error);
            }
        );
        setStompClient(temp);
    }


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if(parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

    const onConnect = () => {
       
        setIsConnect(true);
    }

    const onMessageRecei = (payload) =>{
        const receivedMessage = JSON.parse(payload.body);
        setMessageData(prevData => ({
            ...prevData,
            userMessages: [...prevData?.userMessages, receivedMessage],
        }));        
        // dispatch(getAllChat({token: token, userId: user?.id}))
    }

    //subscribe phòng chat để nhận tin nhắn
    useEffect(() => {
        if(currentChat.chatId && isConnect && stompClient) {
            const subscription = stompClient.subscribe("/group/" + currentChat?.chatId?.toString(), onMessageRecei)
            return () => {
                subscription.unsubscribe();
            }
        }
    },[currentChat])

    // mở connect socket
    useEffect(() => {
        connect();
    }, [])

    const handleSearch = (keyword) => {
        const data = {
            token: token,
            query: keyword
        }
        dispatch(searchUser(data));  // Gọi action tìm kiếm người dùng
    }
    const handleSelectUser = (userChatWith) => {
        setCurrentChat({show: true});
        setUserChatWith(userChatWith)
        const chatData = {
            token: token,
            id :userChatWith.id
        } 
        dispatch(getSingleChat(chatData))
        // xử lý với trường hợp là mở chat room trong lúc tìm kiếm
        setIsSelectUserSearch(true);
        // chỉ load tin nhắn khi mở chat room lần đầu
        setIsOpenChatFirst(true);
        // xử lý khi ấn qua chat room khác xong ấn về lại không bị duplicate tin nhắn
        setIsSend(false);

        setMessageData({userChat:'', userMessages:''});
    }
    const handleSelectChatCard = (userChatWith, chatId) => {
        setCurrentChat({show: true, chatId: chatId});
        setUserChatWith(userChatWith)
        const chatData = {
            token: token,
            id :userChatWith.id
        } 
        dispatch(getSingleChat(chatData))
        // chỉ load tin nhắn khi mở chat room lần đầu
        setIsOpenChatFirst(true);
        // xử lý khi ấn qua chat room khác xong ấn về lại không bị duplicate tin nhắn
        setIsSend(false);
    }
    const handleSelectChatCardGroup = (group) => {
        setCurrentChat({show: true, chatId: group?.chatId});
        setUserChatWith(group);
        const chatData = {
            token: token,
            chatId:  group?.chatId,
        }
        dispatch(getChatById(chatData))
        // chỉ load tin nhắn khi mở chat room lần đầu
        setIsOpenChatFirst(true);
        // xử lý khi ấn qua chat room khác xong ấn về lại không bị duplicate tin nhắn
        setIsSend(false);
    }

        // Hàm khi người dùng chọn emoji
    const handleEmojiSelect = (emojiData) => {
        setContent((prevMessage) => prevMessage + emojiData.emoji); // Thêm emoji vào tin nhắn
    };

    const handleSelectPicture = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(true);
            setImages(prev => [...prev, reader.result])
          };
          reader.readAsDataURL(file);
        }
    };
    const handleRemovePicture = (pos) => {
        const imagesNew = images.filter((el, index) => index !== pos );
        setImages(imagesNew);
    }
    const handleSendMessage =() => {
        // xu li gui tin nhan riêng tư lần đầu
        if(!chat) {
            const data = {
                token: token,
                messageReq: {
                    content: content,
                    receiverId: userChatWith.id,
                    type: selectedImage? 'image': 'text',
                    medias: images,
                }
            }
            // setFirstChat(true)
            dispatch(sendMessage(data))
            setIsSend(true);
            setIsOpenChatFirst(false);
        }   
        if(chat) {
            if(!chat?.group) {
                const data = {
                    token: token,
                    messageReq: {
                        content: content,
                        receiverId: userChatWith.id,
                        type: selectedImage? 'image': 'text',
                        medias: images,
                    }
                }
                dispatch(sendMessage(data))
                setIsSend(true);
            }else {
                const data = {
                    token: token,
                    messageReq: {
                        content: content,
                        chatId: userChatWith?.chatId,
                        type: selectedImage? 'image': 'text',
                        medias: images,
                    }
                }
                dispatch(sendMessageGroup(data))
                setIsSend(true);
            }
        }
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
        let messagesWithAvatar;
        if(chat) {
            messagesWithAvatar = chat?.userMessages?.map((message, index, arr) => {
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
              if(isOpenChatFirst) { 
                    setMessageData({ userChat: chat?.userChat, userMessages: messagesWithAvatar,})
                    setIsOpenChatFirst(false);
              }
        }
        // send socket
        if(message && stompClient && isSend) {
            stompClient.send("/app/message", { "content-type": "application/json"}, JSON.stringify({...messagesWithAvatar[messagesWithAvatar?.length-1], chatId: currentChat?.chatId}))
        }
    }, [chat])

    useEffect(() => {
        if(isSelectUserSearch && chat) {
            setIsSelectUserSearch(false);
            setCurrentChat({show: true, chatId: chat?.id});
            const chatData = {
                token: token,
                id :userChatWith.id
            } 
            dispatch(getSingleChat(chatData))
        }
    }, [chat])
    
    useEffect(() => {
        if(message && message?.status == 200) {
                if(!chat?.group) {
                    const chatData = {
                        token: token,
                        id :userChatWith?.id
                    }
                    dispatch(getSingleChat(chatData))
                }else {
                    const chatData = {
                        token: token,
                        chatId: userChatWith?.chatId,
                    }
                    dispatch(getChatById(chatData))
                }
        }else {
            //xử lý lỗi ở đây nha quân
        }
    }, [message])

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageData.userMessages]);

    useEffect(() => {
        dispatch(getAllUser(token))
      },[])
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
                            <TbCircleDashed onClick={handleOpenStatusModal} className='cursor-pointer'/>
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
                        <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        {loading ? (
                            <p>Loading...</p>
                            ) : search !== '' ? (
                            users?.length > 0 ? (
                                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                {users.map((item) => {
                                    if(item?.id == user?.id) return;
                                    return (
                                    <div key={item.id} onClick={() => handleSelectUser(item)}>
                                    <ChatCard user={item} isHide={true} />
                                    </div>
                                )}
                            )}
                                </div>
                            ) : (
                                <div className="flex justify-center mt-5">
                                <p className="text-sm text-gray-500">Không có bạn bè phù hợp</p>
                                </div>
                            )
                            ) : (
                            chats?.length > 0 ? (
                                chats.map((chat, index) => {
                                if (!chat.group) {
                                    const otherUser = chat.userChat.find(uc => uc.user.id !== user?.id)?.user;
                                    return (
                                    <div key={chat.id || index} onClick={() => handleSelectChatCard(otherUser, chat?.id)}>
                                        <ChatCard
                                            user={otherUser}
                                            isHide={false}
                                            time={chat?.userMessages?.at(-1)?.message?.timestamp}
                                            messageLast={chat?.userMessages?.at(-1)?.message?.content}
                                            isMe = {chat?.userMessages?.at(-1)?.senderUser.id == user?.id}
                                        />
                                    </div>
                                    );
                                } else {
                                    const group = {
                                    chat_name: chat?.chat_name,
                                    chat_image: chat?.chat_image,
                                    chatId: chat?.id,
                                    };
                                    return (
                                    <div key={chat.id || index} onClick={() => handleSelectChatCardGroup(group)}>
                                        <ChatCard group={group}
                                                 isHide={false}
                                                 time={chat?.userMessages?.at(-1)?.message?.timestamp}
                                                 messageLast={chat?.userMessages?.at(-1)?.message?.content}
                                                 isMe = {chat?.userMessages?.at(-1)?.senderUser.id == user?.id}
                                                 />
                                    </div>
                                    );
                                }
                                })
                            ) : (
                                <div className="text-center text-sm text-gray-400 mt-4">
                                Bắt đầu trò chuyện với bạn bè!
                                </div>
                            )
                        )}
                        </div>
                    </>
                        )}
            </div>
            <div  className='right flex-1 flex flex-col overflow-hidden'>
                {/* Default page */}
                { !currentChat?.show && <div className='flex flex-col h-full items-center justify-center'>
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
                {currentChat?.show &&
                    <div className='relative h-full w-full' >
                        <div className='header absolute top-0 w-full bg-[#f0f2f5] z-50'>
                            <div className='flex items-center justify-between p-3'>
                                <div className='flex items-center space-x-3'>
                                    <img
                                    src={userChatWith?.profile_picture || userChatWith?.chat_image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s'}
                                    className='w-10 h-10 rounded-full object-cover'
                                    />
                                    <p>{userChatWith?.full_name || userChatWith?.chat_name || 'Chip'}</p>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <AiOutlineSearch className='text-xl '/>
                                    <BiDotsVerticalRounded className='text-xl '/>
                                </div>
                            </div>
                        </div>
                        {/* Message section */}
                        <div className='bg-blue-200 h-full w-full overflow-y-scroll'>
                            <div className='py-20 pl-10 pr-4 space-y-2 flex flex-col justify-center '>
                                {messageData.userMessages && messageData.userMessages.map((item, index) => {
                                return (
                                    <MessageCard
                                        key={index}
                                        showAvatar={item.showAvatar}
                                        isReceiUserMessage={item?.senderUser?.id !== user.id}
                                        content={item?.message?.content}
                                        time={item?.message?.timestamp}
                                        avatar={item?.senderUser?.profile_picture}
                                        type = {item?.message?.type}
                                        images = {item?.message?.medias}
                                    />
                                )})}
                                {/* Phần tử đánh dấu cuối danh sách */}
                                <div ref={bottomRef}></div>
                            </div>
                        </div>
                        {/* Emoji */}
                        {showEmoji && (
                            <div className='absolute top-28 -left-5'>
                                <EmojiPicker onEmojiClick={handleEmojiSelect} />
                            </div>
                        )}
                        {/* footer part */}
                        <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full'>
                             {/* show image khi chon */}
                            <div className='ml-28 flex space-x-2'>
                                {images && images?.map((item, index) => {
                                    return (
                                        <div className='relative mt-3'>
                                            <IoIosClose className='absolute -right-2 -top-2 text-xl cursor-pointer' onClick={() => handleRemovePicture(index)}/>
                                            <img src ={item}
                                                width={100} 
                                                height={100}
                                                className='rounded-md object-cover border cursor-pointer'
                                            />     
                                        </div>
                                    );
                                    })
                                }
                            </div>
                            <div className=' flex justify-between items-center p-3 z-50'>
                                <div className='flex space-x-6'>
                                    <BsEmojiSmile className='cursor-pointer text-2xl' onClick={() => setShowEmoji(!showEmoji)}/>
                                    <div>
                                        <label htmlFor='imgInput'>
                                            <FaImage  className='cursor-pointer text-2xl'/>
                                        </label>
                                        <input type="file" id="imgInput" className="hidden" accept="image/*" onChange={handleSelectPicture} />
                                    </div>
                                </div>
                                <input 
                                    className='py-2 px-2 outline-none border-none bg-white rounded-lg w-[85%]' 
                                    type='text' 
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder='Nhập tin nhắn...'
                                    value={content}
                                    onKeyPress={(e) => {
                                        if(e.key == "Enter") {
                                            handleSendMessage();
                                            setContent('');
                                            setImages([]);
                                            setSelectedImage(false);
                                        }
                                    } }
                                />
                                <BsMicFill className='cursor-pointer text-2xl'/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
        {/* Status Modal */}
      <StatusModal 
        open={statusModalOpen} 

        onClose={handleCloseStatusModal} 
      />
    </div>
  )
}
