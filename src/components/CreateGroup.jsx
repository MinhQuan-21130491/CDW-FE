import {useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { SelectedMember } from './SelectedMember';
import { AiOutlineSearch } from 'react-icons/ai';
import UserCard from './UserCard';
import NewGroup from './NewGroup';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../redux/user/action';

export default function CreateGroup({handleNavigate, onlineUsers, stompClient}) {
  const[newGroup, setNewGroup] = useState(false);
  const [groupMember, setGroupMember] = useState(new Map());
  const[search, setSearch] = useState("");
  const[render, setRender] = useState(false);
  const token = localStorage.getItem("token");
  const { users, error, loading } = useSelector(state => state.user);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const handleRemoveMember = (member) => {
    setGroupMember(prev => {
      const newMap = new Map(prev);
      newMap.delete(member?.email);
      return newMap;
    });
    setRender(!render);
  };
    const handleSearch = (keyword) => {
          const data = {
              token: token,
              query: keyword
          }
          dispatch(searchUser(data));  // Gọi action tìm kiếm người dùng
      }

    const handleAddMember = (user) => {
      setGroupMember(prev => {
        const newMap = new Map(prev);
        newMap.set(user.email, user); // nếu trùng email thì ghi đè
        return newMap;
      });
      setSearch("");
    };  
      
      
  const handleSetNewGroup = (isNewGroup) => {
    setNewGroup(isNewGroup);
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
                {groupMember.size > 0 && Array.from(groupMember.values()).map((item, index) => <SelectedMember key={index} handleRemoveMemner={() => handleRemoveMember(item)} member={item} /> )}
            </div>
            <div className='relative flex justify-center items-center bg-white space-x-2'>
              <input 
                className='border-none outline-none bg-slate-200 rounded-md w-[93%] py-2 pl-9 pr-4'
                type='text'
                placeholder='Tìm kiếm bạn bè'
                onChange={(e) => {
                    setSearch(e.target.value)
                    handleSearch(e.target.value)
                }}
                value = {search}
                />
              <AiOutlineSearch className='text-xl absolute left-3'/>
            </div>
          </div>
          <div className='overflow-y-auto overflow-x-hidden mt-4 px-2 '>
            {search && users.map((item, index) =>
              {
                if(item?.id == user?.id) return;
                return (
                  <div key={index} onClick={() => handleAddMember(item)}>
                    <hr className={index !== 0 ?`mt-2`:''}/>
                    <UserCard user={item} isOnline={onlineUsers.includes(item.id)}/>
                  </div>
                  )
                })
              }
          </div>
          {groupMember.size > 1 && search === '' && 
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
      {newGroup && <NewGroup handleSetNewGroup = {handleSetNewGroup} members = {groupMember} handleNavigate = {handleNavigate} stompClient = {stompClient}/>}
  </>
  );
}
