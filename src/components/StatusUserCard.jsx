import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StatusUserCard() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    // navigate(`/status/{userId}`)
  }
  return (
    <div onClick={handleNavigate} className='flex items-center pt-3 cursor-pointer w-[100%]'>
        <div className='md:w-[30%] w-[100%]'>
            <img
                src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"
                className='w-12 h-12 rounded-full object-cover'
            />
        </div>
        <div className='text-white w-[65%] hidden md:block text-ellipsis overflow-hidden whitespace-nowrap'>
            <p>Chip</p>
        </div>
    </div>
  )
}
