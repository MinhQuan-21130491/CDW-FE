import React, { useState } from 'react';
import { BsArrowLeft, BsArrowRight, BsCheck2, BsPencil } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function NewGroup({handleSetNewGroup}) {
    const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [groupName, setGroupName] = useState(null);
  return (
    <div className=' w-full h-full bg-[#f0f2f5] '>
        <div className='pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white'>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={() =>handleSetNewGroup(false)}/>
            <p className='cursor-pointer font-semibold text-xl '>Nhóm chat mới</p>
        </div>
        {/* update profile pic section */}
        <div className='flex flex-col justify-center items-center my-8'>
          <label htmlFor='imgInput'>
              <img 
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtH3-0w5YZo8m01xHjGu3DbqJbLzjKODATcA&s'
                className='rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer'
              />
          </label>
          <input type='file' id="imgInput" className='hidden'/>
        </div>
        {/* name section */}
        <div className='px-3 bg-white'>
            <p className='pt-3 font-semibold'>Tên nhóm chat</p>  
          <div className='flex items-center justify-between' >
              <input
                className='w-[100%] outline-none border-b-2 border-green-600 mt-2 pb-1 mb-3' 
                type='text' 
                placeholder='Nhập tên nhóm chat' 
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                />
            </div>
        </div>
        {groupName &&(
        <div className='fixed md:w-[350px] sm:w-[100px] bottom-[2.15rem] py-10 bg-slate-200 items-center justify-center flex text-5xl cursor-pointer'>
                <div onClick={() => {
                }}>
                <BsArrowRight className='text-white font-bold  bg-[#008069] rounded-full p-1'/>
            </div>
        </div>
        )}
         
    </div>
  )
}

export default NewGroup;