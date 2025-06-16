import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from 'react-icons/bs'
import { TbCircleDashed } from 'react-icons/tb'
import ChatCard from '../components/ChatCard'
import { avatar_default, logo } from '../assets'
import { TbPhotoEdit } from "react-icons/tb";
import MessageCard from '../components/MessageCard'
import { IoIosClose } from "react-icons/io";
import { FaCircle, FaImage } from "react-icons/fa";
import Profile from '../components/Profile'
import { useNavigate } from 'react-router-dom'
import { Alert, CircularProgress, Menu, MenuItem, Snackbar, styled } from '@mui/material'
import CreateGroup from '../components/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { currentUser } from '../redux/auth/Action'
import { getAllUser, searchUser } from '../redux/user/action'
import UserCard from '../components/UserCard'
import { sendMessage, sendMessageGroup } from '../redux/message/action'
import { deleteChat, getAllChat, getChatById, getSingleChat, removeUserFromGroup } from '../redux/chat/action'
import EmojiPicker from "emoji-picker-react";
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs';
import StatusModal from './StatusModal'
import GroupManagementModal from '../components/ManageChatGroup'
import { BASE_API_URL } from '../config/api'
import { ViewMember } from '../components/ViewMember'
import AlertDialog from '../components/AlertDialog'

const LoadingOverlay = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
});

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
    const { message:msg } = useSelector(state => state.chat);
    const { chats, error: errorChats, loading: loadingChats } = useSelector(state => state.chat);
    const [userChatWith, setUserChatWith] = useState();
    const [messageData, setMessageData] = useState({userChat:'', userMessages:''});
    const token = localStorage.getItem('token')
    const [showEmoji, setShowEmoji] = useState(false)
    const [selectedImage, setSelectedImage] = useState(false);
    const [images, setImages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnect, setIsConnect] = useState(false);
    const [isSelectUserSearch, setIsSelectUserSearch] = useState(false);
    const [isOpenChatFirst, setIsOpenChatFirst] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [isOpenManageChat, setIsOpenManageChat] = useState(false);
    const [enhancedChats, setEnhanceChats] = useState();
    const [userInChat, setUserInChat] = useState();
    const stompClient = useRef(null);
    const isConnecting = useRef(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [openViewMember, setOpenViewMember] = useState(false);
    const [usersInGroup, setUsersInGroup] = useState();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openAlertDialogRemoveChat, setOpenAlertDialogRemoveChat] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const status = useRef("");
    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    };
     const handleOpenViewMember = () => {
        setOpenViewMember(true);
      };
      const handCloseViewMember = () => {
        setOpenViewMember(false);
      };

    const handleOpenStatusModal = () => {
        setStatusModalOpen(true);
      };
    
    const handleCloseStatusModal = () => {
        setStatusModalOpen(false);
      };
    const handleOpenAlertDialog = () => {
        handleCloseChat();
        setOpenAlertDialog(true);
    }
    const handleCloseAlertDialog = () => {
        setOpenAlertDialog(false);
        setOpenAlertDialogRemoveChat(false);
    } 
    const handleOpenAlertDialogRemoveChat = () => {
        handleCloseAlertDialogRemoveChat();
        setOpenAlertDialogRemoveChat(true);
    }
    const handleCloseAlertDialogRemoveChat = () => {
        setOpenAlertDialogRemoveChat(false);
    }
    const handleNavigateChangePassword = () => { 
        navigate('/change-password');
    };

    //websocket
    // xử lý render lại UI list chat
    function onReceiNewMessage(payload) {
        const res = payload.body;   
        if(res && res === 'New message') {
            dispatch(getAllChat({token: token, userId: user?.id}))
        }
    }
    const onChange = (payload) => {
        const res = JSON.parse(payload.body);
        if(res?.name_request === 'change group name') {
            setUserChatWith({chatId : res?.chatId, chat_name: res?.chat_name, chat_image: res?.chat_image})
            dispatch(getAllChat({token: token, userId: user?.id}))
        }
    }
    const onReceiBroadcast = (payload) => {
        const res = JSON.parse(payload.body);
        if (
            res?.message === "Add user to group success" ||
            res?.message === "Remove user in group successfully" ||
            res?.message === "You have been added to group"
        ) {
            dispatch(getAllChat({ token: token, userId: user?.id }));
            dispatch(getChatById({ token: token, chatId: res?.chatId }));
            setCurrentChat({ ...currentChat, show: false });
        } else if (res?.message === "Out group successfully") {
            dispatch(getAllChat({ token: token, userId: user?.id }));
            dispatch(getChatById({ token: token, chatId: res?.chatId }));
            if (res?.requestId === user?.id) {
                setCurrentChat({ ...currentChat, show: false });
            }
        }
    };

    const reloadUserInChat = () => {
        dispatch(getChatById({token: token, chatId: currentChat.chatId}))
    }
    const connect = () => {
        if (stompClient.current?.connected || isConnecting.current) {
            console.log("⚠️ Already connecting or connected to WebSocket");
            return;
        }

        isConnecting.current = true;

    const client = new Client({
            webSocketFactory: () => new SockJS(`${BASE_API_URL}/ws`),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,  // Thêm heartbeat để giữ kết nối
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('[WebSocket]', str),
            connectHeaders: {
                // Authorization: `Bearer ${token}`,
                userId: user?.id?.toString() || '',
            },
        });

        stompClient.current = client;
        client.subscriptions = []; // Lưu trữ các subscription

        client.onConnect = (frame) => {
            console.log("✅ Connected to WebSocket");
            setIsConnect(true);
            const onlineUsersSub = client.subscribe("/topic/online-users", (message) => {
                try {
                    const userIds = JSON.parse(message.body);
                    setOnlineUsers(userIds);
                    console.log("📥 Online users:", userIds);
                } catch (error) {
                    console.error("❌ Failed to parse message:", error);
                }
            });
            const messageSub = client.subscribe("/topic/message/"+ user?.id, onReceiNewMessage);
            const notificationSub = client.subscribe("/topic/change", onChange);
            const broadcastNotificationToUser = client.subscribe("/topic/notification/" + user.id, onReceiBroadcast) ;
            // Lưu các subscription để hủy sau này
            client.subscriptions.push(onlineUsersSub, notificationSub,broadcastNotificationToUser,messageSub );

            // Sau khi subscribe
            setTimeout(() => {
                client.publish({
                    destination: "/app/init-online-users",
                    body: JSON.stringify({})
                });
            }, 200);

            isConnecting.current = false;
        };

        client.onStompError = (frame) => {
            console.error("❌ STOMP Error:", frame);
            isConnecting.current = false;
            setIsConnect(false);
        };

        client.onWebSocketError = (evt) => {
            console.error("❌ WebSocket error:", evt);
            isConnecting.current = false;
            setIsConnect(false);
        };

        client.onDisconnect = () => {
            console.log("🔌 Disconnected");
            setIsConnect(false);
            isConnecting.current = false;
        };
        client.activate();
    };

    const disconnect = async () => {
        if (stompClient.current) {
            try {
                // Hủy tất cả subscription trước
                stompClient.current.subscriptions?.forEach(sub => sub.unsubscribe());
                stompClient.current.subscriptions = [];
                
                if (stompClient.current.connected) {
                    await stompClient.current.deactivate();
                }
            
                console.log("🔌 Disconnected");
            } catch (err) {
                console.error("❌ Disconnect error", err);
            } finally {
                stompClient.current = null;
                setIsConnect(false);
                isConnecting.current = false;
            }
        }
    };

    useEffect(() => {
        const handleBeforeUnload =  () => {
             disconnect();
        };

        if (user && !isConnecting.current) {
            connect();
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [user, isConnecting]);
    const onMessageRecei = (payload) =>{
        const receivedMessage = JSON.parse(payload.body);
        setMessageData(prevData => ({
            ...prevData,
            userMessages: [...prevData?.userMessages ?? [], receivedMessage],
        }));        
    }

    //subscribe phòng chat để nhận tin nhắn
        useEffect(() => {
        if(currentChat.chatId && isConnect && stompClient) {
            const subscription = stompClient.current.subscribe("/group/" + currentChat?.chatId?.toString(), onMessageRecei)
            return () => {
                subscription.unsubscribe();
            }
        }
    },[currentChat])



    const handleSearch = (keyword) => {
        const data = {
            token: token,
            query: keyword
        }
        if(!isOpenManageChat) {
            dispatch(searchUser(data));  // Gọi action tìm kiếm người dùng
        }
    }
    const handleSelectUser = (userChatWith) => {
        setCurrentChat({show: true});
        setUserChatWith(userChatWith)
        const chatData = {
            token: token,
            id :userChatWith.id
        } 
        setUserInChat([userChatWith?.id]);
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
        setUserInChat([userChatWith?.id]);
        dispatch(getSingleChat(chatData))
        // chỉ load tin nhắn khi mở chat room lần đầu
        setIsOpenChatFirst(true);
        // xử lý khi ấn qua chat room khác xong ấn về lại không bị duplicate tin nhắn
        setIsSend(false);
    }
    const handleSelectChatCardGroup = (group) => {
        const isAdmin = group?.userChat?.some(uc => {
          return uc.user.id === user?.id && uc.admin
        });
        setCurrentChat({show: true, chatId: group?.chatId, chat_name: group?.chat_name, isAdmin: isAdmin});
        setUserChatWith(group);
        const chatData = {
            token: token,
            chatId:  group?.chatId,
        }
        const usersInGroup = group?.userChat?.map((u) => {return u?.user.id});
   
        setUserInChat(usersInGroup);
        dispatch(getChatById(chatData));
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
            setIsOpenChatFirst(true);
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
    const [anchorElChat, setAnchorElChat] = useState(null);
    const openChat = Boolean(anchorElChat);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickChat = (event) => {
        setAnchorElChat(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseChat = () => {
        setAnchorElChat(null);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin')
        disconnect();
    };
    const handleCreateGroup = (isShow) => {
        setIsGroup(isShow)
        setAnchorEl(null);
    };
    const handleUserUpdate = () => {
        dispatch(currentUser(token));
    };
    const handleManageChat = () => {
        setIsOpenManageChat(true);
    }
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
        if(message && stompClient.current && isSend) {
            stompClient.current.publish({
                destination: '/app/message',
                body: JSON.stringify({
                    ...messagesWithAvatar[messagesWithAvatar?.length - 1],
                    chatId: currentChat?.chatId,
                    receiverIds : userInChat,
                    isSeen: true,
                }),
                headers: { 
                    'content-type': 'application/json'
                }
            });    
            setIsSend(false);    
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
    }, [messageData.userMessages, currentChat]);

    useEffect(() => {
        dispatch(getAllUser(token))
      },[])

   useEffect(() => {
    if (onlineUsers.length > 0 && user?.id) {
        const chatsWithOnlineStatus = chats?.map(chat => {
            // Kiểm tra xem có bất kỳ user nào (không phải mình) đang online không
            const hasOnlineUser = chat?.userChat?.some(userChat => 
                userChat?.user?.id && 
                userChat.user.id !== user.id && 
                onlineUsers.includes(userChat.user.id)
            );
            
            return {
                ...chat,
                online: !!hasOnlineUser 
            };
        });

        setEnhanceChats(chatsWithOnlineStatus || []);
    }
    }, [onlineUsers, chats, user?.id]);
    const handleOutChat = () => {
        const data = {
               token: token,
               chatId: currentChat?.chatId,
               userId: user?.id,
            }
        dispatch(removeUserFromGroup(data));
        handleCloseAlertDialog();
    }
    const handleViewMember = () => {
        handleOpenViewMember();
    }
    useEffect(() => {
        if(msg === "Out group successfully") {
            stompClient.current.publish({
              destination: '/app/broadcast-notification',
              body: JSON.stringify({
                  receiverIds: userInChat,
                  message: "Out group successfully",
                  chatId: chat?.id,
                  requestId: user?.id,
                }),
              headers: { 
                  'content-type': 'application/json'
              }
            });
            dispatch(getAllChat({token: token, userId: user?.id}));
            setOpenSnackBar(true);
            setCurrentChat({show:false});
            status.current = "Rời nhóm thành công"
        }
        if(msg === "Remove chat successfully") {
            dispatch(getAllChat({token: token, userId: user?.id}));
            setOpenSnackBar(true);
            setCurrentChat({show:false});
            status.current = "Xóa chat thành công"
        }
    }, [msg])
      useEffect(() => {
        const usersInGroup = chat?.userChat?.map((u) => {return u?.user});
        setUsersInGroup(usersInGroup);
      }, [chat, users])
    const handleRemoveChat = (chatId) => {
        const data = {
            token: token,
            chatId: chatId,
        }
        dispatch(deleteChat(data));
    }
    useEffect(() => {
        if(onlineUsers) {
            if (onlineUsers.includes(userChatWith?.id)) {
                setIsOnline(true);
            }else {
                setIsOnline(false);
            }
        }
       
    }, [onlineUsers, userChatWith])
  return (
    <div className='relative h-screen bg-slate-300 '>
        <div className='w-full py-14 bg-primeColor '></div>
        <div className='flex bg-[#f0f2f5] h-[90vh] absolute top-9 left-10 right-10 z-50 shadow-md'>
            <div className='left md:w-[350px] sm:w-[100px] bg-white h-full flex flex-col' >
                {/* Profile */}
                {isProfile && (<div className='w-full h-full bg-[#f0f2f5]'><Profile handleNavigate = {handleNavigateProfile}  user={user} onUpdateUser={handleUserUpdate}/></div>)}
                {/* Create group */}
                {isGroup && (<CreateGroup handleNavigate = {handleCreateGroup} onlineUsers={onlineUsers} stompClient = {stompClient.current}/>)}
                {/* Home */}
                {!isProfile && !isGroup && (
                    <>
                      <div className='flex items-center justify-between p-3 bg-[#e8e9ec]'>
                        <div className='flex items-center space-x-3 overflow-hidden'
                            onClick={() => handleNavigateProfile(true)}
                        >
                            <div className="relative w-16 h-12">
                                <img className='rounded-full w-12 h-12 object-cover cursor-pointer' src={user?.profile_picture || 'data:image/png;base64,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'}></img>
                                <FaCircle className={`absolute bottom-0 left-9 text-green-400 text-xs bg-white rounded-full`} />
                            </div>
                            <p className='cursor-pointer text-lg'>{user?.full_name}</p>
                        </div>
                        <div className='space-x-2 text-2xl hidden md:flex'>
                            <TbPhotoEdit onClick={handleOpenStatusModal} className='cursor-pointer'/>
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
                                    <MenuItem onClick={() => handleNavigateChangePassword()}>Đổi mật khẩu</MenuItem>
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
                        {loading && !isOpenManageChat ? (
                            <LoadingOverlay>
                                <CircularProgress color="secondary" />
                            </LoadingOverlay>
                            ) : search !== '' ? (
                            users?.length > 0 ? (
                                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                {users.map((item) => {
                                    if(item?.id == user?.id) return;
                                    return (
                                    <div key={item.id} onClick={() => handleSelectUser(item)}>
                                    <ChatCard user={item} isHide={true} isOnline={onlineUsers.includes(item?.id)} />
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
                            enhancedChats?.length > 0 ? (
                                enhancedChats.map((chat, index) => {
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
                                            isOnline={chat?.online}
                                            typeMessageLast = {chat?.userMessages?.at(-1)?.message?.type}
                                        />
                                    </div>
                                    );
                                } else {
                                    const group = {
                                    chat_name: chat?.chat_name,
                                    chat_image: chat?.chat_image,
                                    chatId: chat?.id,
                                    userChat: chat?.userChat,
                                    };
                                    return (
                                    <div key={chat.id || index} onClick={() => handleSelectChatCardGroup(group)}>
                                        <ChatCard group={group}
                                                 isHide={false}
                                                 time={chat?.userMessages?.at(-1)?.message?.timestamp}
                                                 messageLast={chat?.userMessages?.at(-1)?.message?.content}
                                                 isMe = {chat?.userMessages?.at(-1)?.senderUser.id == user?.id}
                                                 isOnline={chat?.online}
                                                 typeMessageLast = {chat?.userMessages?.at(-1)?.message?.type}
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
                                     <div className="relative w-16 h-12">
                                        <img
                                            src = {userChatWith?.profile_picture || userChatWith?.chat_image || avatar_default}
                                            className='w-12 h-12 rounded-full object-cover'
                                        />
                                        {isOnline && (
                                            <FaCircle className={`absolute bottom-0 left-9 text-green-400 text-xs bg-white rounded-full`} />
                                        )}
                                        </div>
                                    {/* <img
                                        src={userChatWith?.profile_picture || userChatWith?.chat_image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///9UWV1PVFmBhYdKUFS1t7hDSU5ARktFS09RVlpITlJNUlc+RElESk5MUVbGx8j4+PiipKbe39+LjpBZXmKusLLu7++8vr/P0NHY2dnl5uZiZmqTlpioqqz09PR3e35scHN8gIKPkpRfZGecnqBpbXBB8wY2AAAGRElEQVR4nO2dW3uqOhBAC4RcQEWhgHdqtf//Lx5S6/bstlYDM8zQnfXQvrq+JJNkQiZPTx6Px+PxeDwezx/meRYvtkUURcV2EWf5nPoHgbIqo1DpRMzS0JLORKJVeChX1D8MhCpupBYm+IoRWjVxRf0De1K/qG/trpbqpab+kd2pTjL5Se9DMplux9mQ60ild/XOpCpaU/9cZ/aFCh/0s4Sq2FP/ZDd2Tn5nxx31j3ZgFQhHP4sIRjN7nCb348t3mMmJ+qc/RLXp0oAfzbgZQVRdTrs14EczyiW1wD3iSQ8/y6SkVviZk+wpGART1oPxVfcWDAJdUGvcpkgABIMgYau4hRFsFbfUKt+z6z8GL0iW65tMgQkGgcqodb6yhhRsFfltNoI+E/1XTEAt9Jno0b3go6QRtdLfZHBR5oJkNRTnEDP9ZzSnhCN4H7Vw6qcr2Dh6QfHZEW9g4+gFs6EWu5BhjEKL5hJsnnGasG3EZ2q1M2hNyKYR37CasG3EN2o5Sw4/2V+RObVeyyvGXHghfaXWa8FswrYRqfXaOAO1sf+ehD7WRK4HFG6E9Es33E7KoJsu8SbDM5o6Cb7AjKSWdEFs+II33Z8xL8SG2MOQfCDm2MOwHYi0yxrk2dBCPCMuZuiGM9pQU+DO95aQ9pwGPZSSB1N0Pwup4XQAQdrpAieN+DeKUnCOP+G3bUiZ+94PYkj5xdvvb8Pfb/j7I80T/rK0XZiSGqIl9K8Qp/abAQwbUsPXAVbetEnhsvu3pI8iaD9W/P074PUAeRrib4cGyNPQCuIHU3MgNiyxEzUz6q+iUc9HLfRnpNhtmFILPm1xDy5S+s+FV7jRVDP4Lgr5hJRa7wk57U2c8D5TYe6CFYt7UIgn+QxO8S05XiMq8snwDNrKjXjzewWtEbk0IdpIZDIKLUjhlEcgPbPDSGYkrC4/HeGDjTlSS/3Fuu/l2K9MmN182kEvwDWrPmppYONpyGUqvDI3kEPRGE5Xgj4AvYDI8PphyxIu2kyoP7m8QQalOKH/9PkGNYzihHFdJRBFzoLtWOwfbriOwQv5j6W97mMEmx3TLfY9ytPYAjVjKBe17d5TFX3+9yGWolsePBXMh+CVeaHcR6NRBcOV2k1WR9e9hj4yyN87UYcPVBT8035JyHoSvEEd6Md2VEYHY/SzZHcqX77rzdQL22XoA1S7Zzm7LWlm0+cdy42SC+uyUVqEnzVNKLR6KUev98Eqft1oqXUiLInWUm5e47EFz7vs82VWx3FcZ8t8DGszj8fj8Xg8nn+SeVWt1+s8z9u/VTWmhMUP7NfLujwVzVsgpkpKOZXt6lu//5dqKoK3pjiV9ShXqftVvYg2rcf7qx03TxaNCVO71ZDyGC3q1UhE19miEVKL9MuO8MedvkmFlqJZZLw3jKvyoGWSds/rmzSRmuvrLLndyv+QsHDQtK+zlMyOL5bbcApidyGcTdMtmwz4spAapbqnlgUDyXybPJgV7UKoky1td62PU/QqSvIYU+lVJ9nzOPQxjJAniq8UHZ4C6g/BY0Lrg/NTOf0I1WFIxyoa2M9iVDRYXz1NhvezhAO9tJMJ/NvNtxAz/GOqqhmiFMZtZIPcVeMOB/SwGIU5Pc4b/IvN99ENWoJgJWgizGfCGdL2qoT/Wr0rOI9CRRx66AWNcJ3mDb9+oAsCutL3/pnHELwSPoMmriqntNIwmBBwZqxAMxRQmBmY4p5hC1pMCNRR58APHcFhApi5/41bkLkSgkTUiG4rcR8BMC+WnCb6r+jeq5ucz1LteyZ9s42gN9IwMKafIMpTVbD0e/gK4AoMPqpP6p/vPPF/elR4WXCeKK6IziVe9mPooxbVdfWG+goQJF1fFEItrQNLx/oSyFW8IOlWEWw+niZsG7HLJmOA0qRwdCpyOkCJYDi6FBtGL4gIS4fyiujPHMHS4dGkUXXSLt10gPK5sDgX463HFEktwvUK42hWbBecJ32kJ37xcH48eEwLmjOOTyiMLtA4hxrkyrIYOFarHaCaPDSO1elHN1k4TxfxCA3dvkLxhgzxht6QP97QG/LHG3pD/nhDb8gfb+gN+eMNvSF/vKE35I839Ib88YbekD/e0Bvyx9VQh2NDuxlmh2hsHMZc99zj8Xg8Ho/nn+c/deyMTxGEYaMAAAAASUVORK5CYII='}
                                        className='w-10 h-10 rounded-full object-cover'
                                    /> */}
                                    <p>{userChatWith?.full_name || userChatWith?.chat_name || 'Chip'}</p>
                                </div>
                                <div className='flex items-center space-x-3'>
                                        <div>
                                        <BsThreeDotsVertical 
                                        id="basic-button"
                                        aria-controls={openChat ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openChat ? 'true' : undefined}
                                        onClick={handleClickChat}
                                        className='cursor-pointer'
                                        />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorElChat}
                                            open={openChat}
                                            onClose={handleCloseChat}
                                            MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                            }}
                                        >   {userChatWith?.chat_name ? (
                                                currentChat?.isAdmin ? (
                                                <MenuItem onClick={() => handleManageChat()}>Quản lý nhóm</MenuItem>                                          
                                            ): (
                                                <>
                                                    <MenuItem onClick={() => handleViewMember()}>Xem thành viên</MenuItem>                                          
                                                    <MenuItem onClick={() => handleOpenAlertDialog()}>Rời nhóm</MenuItem>
                                                    <MenuItem onClick={handleOpenAlertDialogRemoveChat}>Xóa chat</MenuItem>
                                                </>
                                            )
                                        ): (
                                            <MenuItem onClick={handleOpenAlertDialogRemoveChat}>Xóa chat</MenuItem>
                                        )}
                                            
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Message section */}
                        <div className='bg-blue-200 h-full w-full overflow-y-scroll'>
                            <div className='py-20 pl-10 pr-4 space-y-2 flex flex-col justify-center '>
                                {messageData && messageData?.userMessages && messageData.userMessages.map((item, index) => {
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
                                        )
                                    })}
                                {/* Phần tử đánh dấu cuối danh sách */}
                                <div ref={bottomRef}></div>
                            </div>
                        </div>
                        {/* Emoji */}
                        {showEmoji && (
                            <div className='absolute top-28 left-0 '>
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
        onlineUsers = {onlineUsers}
      />
      <GroupManagementModal open={isOpenManageChat}
                            handleClose={() => setIsOpenManageChat(false)} 
                            chat = {chat} 
                            token = {token} 
                            stompClient = {stompClient?.current}
                            chat_image={userChatWith?.chat_image}
                            reloadUserInChat = {reloadUserInChat}
                            userCurrent={user}
        />
        <Snackbar
            open={openSnackBar} 
            autoHideDuration={3000} 
            onClose={handleSnackBarClose}
        >
            <Alert onClose={handleSnackBarClose} severity={status.current ? 'success' : 'error'} sx={{ width: '100%' }}>
            {status.current || "Đã xảy ra lỗi"}
            </Alert>
        </Snackbar>
        <AlertDialog openAlertDialog ={openAlertDialog} 
                     handleCloseAlertDialog = {handleCloseAlertDialog} 
                     title = "Xác nhận rời nhóm" 
                     content = "Bạn có chắc chắn muốn rời khỏi nhóm này không?"  
                     handleConfirm = {handleOutChat} 
                     handleCancel = {handleCloseAlertDialog}/>
        <ViewMember openViewMember={openViewMember} handleCloseViewMember={handCloseViewMember} usersInGroup = {usersInGroup} />
        <AlertDialog openAlertDialog ={openAlertDialogRemoveChat} 
                     handleCloseAlertDialog = {handleCloseAlertDialogRemoveChat} 
                     title = "Xác nhận xóa đoạn chat" 
                     content = "Bạn có chắc chắn muốn xóa đoạn chat này không?"  
                     handleConfirm = {() => { handleRemoveChat(currentChat?.chatId);
                                             handleCloseAlertDialog()}} 
                     handleCancel = {handleCloseAlertDialog}/>
    </div>
  )
}
