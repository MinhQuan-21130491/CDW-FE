import React, { memo, useState } from 'react'
import { BsArrowLeft, BsArrowRight, BsCheck2, BsPencil } from 'react-icons/bs'
import { SelectedMember } from './SelectedMember';
import { AiOutlineSearch } from 'react-icons/ai';
import ChatCard from './ChatCard';
import StatusUserCard from './StatusUserCard';
import UserCard from './UserCard';
import NewGroup from './NewGroup';

export default function CreateGroup({handleNavigate}) {
  const[newGroup, setNewGroup] = useState(false);
  const[groupMember, setGroupMember] = useState(new Set());
  const[search, setSearch] = useState("");
  const[render, setRender] = useState(false);
  const handleRemoveMember = (member) => {
    groupMember.delete(member);
    setGroupMember(groupMember);
    console.log("delete")
    setRender(!render);
    };
  const handleSearch = (e) => {

  }
  const handleAddMember = (member) => {
    groupMember.add(member);
    setGroupMember(groupMember);
    setSearch("");
  }
  const handleSetNewGroup = (isNewGroup) => {
    setNewGroup(isNewGroup);
    console.log("back")
  }
  return (
    <>
      {!newGroup && (
        <> 
          <div className='pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white  '>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={() =>handleNavigate(false)}/>
            <p className=' font-semibold text-xl '>Tạo nhóm chat</p>
          </div>
          <div className='relative bg-white pt-4'>
            <div className='flex space-x-2 flex-wrap'> 
                {groupMember.size > 0 && Array.from(groupMember).map((item, index) => <SelectedMember key={index} handleRemoveMemner={() => handleRemoveMember(item)} member={item} /> )}
            </div>
            <div className='relative flex justify-center items-center bg-white space-x-2'>
              <input 
                className='border-none outline-none bg-slate-200 rounded-md w-[93%] py-2 pl-9 pr-4'
                type='text'
                placeholder='Tìm kiếm bạn bè'
                onChange={(e) => {
                setSearch(e.target.value)
                }}
                value = {search}
                />
              <AiOutlineSearch className='text-xl absolute left-3'/>
            </div>
          </div>
          <div className='overflow-y-auto overflow-x-hidden mt-4 px-2 '>
            {search && [1,2,3,4,5,6,1,1,1,1].map((item, index) => <div key={index} onClick={() => handleAddMember(item)}><hr className={index !== 0 ?`mt-2`:''}/><UserCard/></div>)}
          </div>
          {groupMember.size > 0 && search === '' && 
            <div className='fixed md:w-[350px] sm:w-[100px] bottom-[2.15rem] py-10 bg-slate-200 items-center justify-center flex text-5xl cursor-pointer'>
                <div onClick={() => {
                 handleSetNewGroup(true);
                }}>
                    <BsArrowRight className='text-white font-bold  bg-[#008069] rounded-full p-1'/>
                </div>
          </div>
          }
          
        </>
      )}
      {newGroup && <NewGroup handleSetNewGroup = {handleSetNewGroup}/>}
  </>
  );
}
