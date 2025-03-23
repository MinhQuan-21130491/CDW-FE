import React from 'react'

export default function MessageCard({isReceiUserMessage, content, showAvatar}) {
  return (
    <div className={`py-1 px-2 rounded-md max-w-[50%] relative ${isReceiUserMessage?"self-start bg-white":"self-end bg-[#d9fdd3]"}`}>
        <div >
            {isReceiUserMessage && showAvatar &&  (
                <div className='absolute -bottom-0 -left-6'>
                <img 
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s'
                    className='w-[20px] h-[20px] rounded-full object-cover'
                />
            </div>
            )}
            <div>
            <p className='text-[14px]'>{content}</p>
            {showAvatar && <p  className='text-[11px] pt-1 text-gray-500'>18:05</p>}
            </div>
        </div>
    </div>
  )
}
