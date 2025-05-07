import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FcAddImage } from "react-icons/fc";
import AddStoryModal from './AddStoryModal';

export default function StatusUserCard({user, isCreate = false}) {
  const[open, setOpen] = useState(false);
  const handleAddStory = () => {
      setOpen(true);
  }
  const handleCloseModal = () => {
      setOpen(false);
  }
  return (
    <div className='flex items-center pt-3 cursor-pointer w-[100%]'>
        <div className='md:w-[30%] w-[100%] flex justify-center'>
            <img
                src = {user?.profile_picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
                className='w-12 h-12 rounded-full object-cover'
            />
        </div>
        <div className='text-white w-[65%] hidden md:block text-ellipsis overflow-hidden whitespace-nowrap'>
            <p>{user?.full_name}</p>
        </div>
        {isCreate && (
          <div>
            <FcAddImage className='text-4xl cursor-pointer' onClick={handleAddStory}/>
          </div>
        )}
        <AddStoryModal open={open} onClose={handleCloseModal} user = {user}/>
    </div>
  )
}
