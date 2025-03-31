import React from 'react'
import StatusUserCard from '../components/StatusUserCard'
import { AiOutlineClose } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import StatusViewer from './StatusViewer';

export default function Status() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  }
  return (
    <div className='w-screen h-screen bg-slate-300'>
        <div className='w-full py-14 '>
            <div className='flex bg-[#f0f2f5] h-[85vh] absolute top-[3.5rem] lg:left-32 lg:right-32 xl:left-52 xl:right-52 sm:left-10 sm:right-10 z-50 shadow-md'>
                {/* left side part */}
                <div className='left md:w-[250px] sm:w-[100px] bg-[#1e262c] h-full flex flex-col px-3 '>
                    <div  className='pb-3'>
                      <StatusUserCard />
                    </div>
                    <hr/>
                    <div className='overflow-y-auto'>
                      {[1,1,1,1].map((item) => <StatusUserCard/>)}
                    </div>
                </div>
                {/* right side part */}
                <div  className='right flex-1 bg-[#0b141a] h-[100%]'>
                    <AiOutlineClose className='text-white cursor-pointer absolute top-3 right-3 text-2xl z-50' onClick={handleNavigate} />
                    <StatusViewer />
                </div>
            </div>
        </div>
    </div>
  )
}
