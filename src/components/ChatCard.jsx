import React from 'react'
import { FaCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function ChatCard({user, isHide, messageLast, time, group, isMe, isOnline}) {
  return (
    <div className='px-3 pb-2 cursor-pointerw-full cursor-pointer'>
        {/* Line separator */}
        <div className='border-t border-gray-300 mb-2 w-full'></div>
        <div className='flex justify-between items-center w-full'>
            <div  className='flex space-x-3 items-center w-[100%]'>
                  <div className="relative w-16 h-12">
                    <img
                      src={user?.profile_picture || group?.chat_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <FaCircle className={`absolute bottom-0 right-0 ${isOnline ? 'text-green-400' :'text-gray-300'} text-xs bg-white rounded-full`} />
                  </div>
                <div className='w-full hidden md:block'>
                     <p className='text-md'>{user?.full_name || group?.chat_name || 'chip'}</p>
                     {!isHide && (
                        <div className='w-[100%] flex justify-between'>
                            <div className='w-[60%]'>
                                <p className='text-xs text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap'>{isMe? "Bạn: " + messageLast || 'Đã gửi hình ảnh':messageLast || 'Đã gửi hình ảnh'}</p>
                            </div>
                            <div className='w-[30%] flex space-x-1 items-center'>
                              <p className='text-xs text-gray-400'>{time && formatTime(time) || ''}</p>
                              {/* <FaCircle className='text-xs text-blue-600' /> */}
                            </div>
                         </div>
                     )}
                </div>  
            </div>
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
  

  
