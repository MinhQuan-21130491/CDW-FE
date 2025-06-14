import { useState } from 'react'
import { FcAddImage } from "react-icons/fc";
import AddStoryModal from './AddStoryModal';
import { FaCircle } from 'react-icons/fa';
import { avatar_default } from '../assets'

export default function StatusUserCard({user, isCreate = false, isOnline = false}) {
  const[open, setOpen] = useState(false);
  const handleAddStory = () => {
      setOpen(true);
  }
  const handleCloseModal = () => {
      setOpen(false);
  }
  return (
    <div className='flex items-center pt-2 mt-1 cursor-pointer w-[100%] px-2'>
        <div className='md:w-[30%] w-[100%] flex justify-center'>
            <div className="relative w-16 h-12">
              <img
                src = {user?.profile_picture || avatar_default}
                className='w-12 h-12 rounded-full object-cover'
            />
              {isOnline && (
                <FaCircle className={`absolute bottom-0 left-9 text-green-400 text-xs bg-white rounded-full`} />
              )}            </div>
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
