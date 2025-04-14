import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserCard({user}) {
  const navigate = useNavigate();
  console.log(user)
  const handleNavigate = () => {
    // navigate(`/status/{userId}`)
  }
  return (
    <div onClick={handleNavigate} className='flex items-center pt-3 cursor-pointer w-[100%]'>
        <div className='md:w-[20%] w-[100%]'>
            <img
                src = {user?.profile_picture
                  || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
                className='w-12 h-12 rounded-full object-cover'
            />
        </div>
        <div className=' w-[80%] hidden md:block text-ellipsis overflow-hidden whitespace-nowrap'>
            <p>{user?.full_name || "Chip"}</p>
        </div>
    </div>
  )
}
