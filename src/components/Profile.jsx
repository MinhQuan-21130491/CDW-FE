import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2, BsPencil, BsPenFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

export default function Profile({handleNavigate}) {
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [username, setUsername] = useState(null);
  return (
    <div className=' w-full h-full'>
        <div className='pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white'>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={() =>handleNavigate(false)}/>
            <p className='cursor-pointer font-semibold text-xl '>Thông tin cá nhân</p>
        </div>
        {/* update profile pic section */}
        <div className='flex flex-col justify-center items-center my-8'>
          <label htmlFor='imgInput'>
              <img 
                src='https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg'
                className='rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer'
              />
          </label>
          <input type='file' id="imgInput" className='hidden'/>
        </div>
        {/* name section */}
        <div className='px-3 bg-white'>
            <p className='pt-3 font-semibold'>Họ tên</p>  
           {flag && <div className='flex items-center justify-between' >
              <input
                className='w-[80%] outline-none border-b-2 border-blue-700 mt-2 pb-1 mb-3' 
                type='text' 
                placeholder='Enter your new name' 
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                />
              <BsCheck2 className='cursor-pointer text-xl' 
              onClick={() => setFlag(false)}/>
            </div>}
           {!flag && <div className='flex items-center justify-between w-full'>
              <p className='py-3'>{username || "Chip"}</p>
              <BsPencil className='cursor-pointer' onClick={() => setFlag(true)}/>
            </div>}
        </div>
    </div>
  )
}
