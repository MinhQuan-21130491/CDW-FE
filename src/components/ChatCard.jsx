import React, { useEffect, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Menu, MenuItem } from '@mui/material';

export default function ChatCard({user, isHide, messageLast, time, group, isMe, isOnline, typeMessageLast, handleRemoveChat}) {
  const [content, setContent] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElChat, setAnchorElChat] = useState(null);
  const openChat = Boolean(anchorElChat);
  const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  useEffect(() => {
      if(typeMessageLast) {
        console.log(typeMessageLast)
        if(typeMessageLast === "text") {
          if(isMe) {
            setContent("Bạn: " + messageLast);
          }else {
            setContent(messageLast);
          }
        }else {
          if(isMe) {
            setContent("Bạn: Đã gửi hình ảnh");
          }else {
            setContent("Đã gửi hình ảnh");
          }
        }
      }
  }, [messageLast, typeMessageLast])
  return (
    <div className='px-3 pb-2 cursor-pointerw-full cursor-pointer'>
        {/* Line separator */}
        <div className='border-t border-gray-300 mb-2 w-full'></div>
        <div className='flex justify-between items-center w-full relative'>
            <div  className='flex space-x-3 items-center w-[100%]'>
                  <div className="relative w-16 h-12">
                    <img
                      src={user?.profile_picture || group?.chat_image || "data:image/png;base64,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"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <FaCircle className={`absolute bottom-0 right-0 ${isOnline ? 'text-green-400' :'text-gray-300'} text-xs bg-white rounded-full`} />
                  </div>
                <div className='w-full hidden md:block'>
                     <p className='text-md'>{user?.full_name || group?.chat_name || 'chip'}</p>
                     {!isHide && (
                        <div className='w-[100%] flex justify-between'>
                            <p className='max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis text-xs text-gray-400'>
                              {content}
                            </p>
                            <div className='w-[30%] flex space-x-1 items-center'>
                              <p className='text-xs text-gray-400'>{time && formatTime(time) || ''}</p>
                              {/* <FaCircle className='text-xs text-blue-600' /> */}
                            </div>
                         </div>
                     )}
                </div>  
            </div>
             {!isHide && (
            <div className="absolute top-0 right-3">
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
                MenuListProps={{'aria-labelledby': 'basic-button',}}
              >
                <MenuItem onClick={handleRemoveChat}>Xóa đoạn chat</MenuItem>
              </Menu>
            </div>
             )}
            <div>
            </div>
        </div>
    </div>
  )
}
function formatTime(dateString) {
    const date = new Date(dateString);
    const dateNow = new Date();
    const diffInMs = dateNow - date;
    const diffInHour = diffInMs/(1000*3600)
    let result = ''
    if(diffInHour< 1) {
      result = (diffInHour * 60).toFixed(0) + " phút";
    }else if(diffInHour > 1 && diffInHour < 24) {
      result = diffInHour.toFixed(0) + " giờ"
    }else{
      result = (diffInHour/24).toFixed(0) + ' ngày'
    }
    return result;
  }
  

  
