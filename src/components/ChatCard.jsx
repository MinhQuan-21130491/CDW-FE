import React from 'react'
import { FaCircle } from "react-icons/fa";

export default function ChatCard({user, isHide, messageLast, time}) {
    
  return (
    <div className='px-3 pb-2 cursor-pointerw-full cursor-pointer'>
        {/* Line separator */}
        <div className='border-t border-gray-300 mb-2 w-full'></div>
        <div className='flex justify-between items-center w-full'>
            <div  className='flex space-x-3 items-center w-[100%]'>
                <img
                    src = {user?.profile_picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
                    className='w-12 h-12 rounded-full object-cover'
                />
                <div className='w-full hidden md:block'>
                     <p className='text-md'>{user?.full_name || 'chip'}</p>
                     {!isHide && (
                        <div className='w-[100%] flex justify-between'>
                        <div className='w-[65%]'>
                            <p className='text-xs text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap'>{messageLast}</p>
                         </div>
                         <div className='w-[30%] flex space-x-1 items-center'>
                            <p className='text-xs text-gray-400'>{formatTime(time)}</p>
                            <FaCircle className='text-xs text-blue-600' />
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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  

  
