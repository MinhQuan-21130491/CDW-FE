import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export const SelectedMember = ({handleRemoveMemner, member}) => {
  return (
    <div className='flex items-center bg-slate-200 rounded-full ml-3 mb-3'>
        <img className='w-7 h-7 rounded-full'
            src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"
        />
        <p className='px-2 pb-1'>Chip</p>
        <AiOutlineClose onClick={handleRemoveMemner} className='pr-1 cursor-pointer'/>
    </div>
  )
}
