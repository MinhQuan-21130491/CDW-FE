import React, { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight, BsCheck2, BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createaGroupChat } from '../redux/chat/action';
import { Alert, CircularProgress, Snackbar } from '@mui/material';

function NewGroup({handleSetNewGroup, members, handleNavigate, stompClient}) {
  const usersId = Array.from(members.values()).map(user => user.id);
  const [click, setClick] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [picture, setPicture] = useState('');
  const[openSnackBar, setOpenSnackBar] = useState(false);
  const[status, setStatus] = useState(false );
  const {status: statusCreateGroup, loading} = useSelector(state => state.chat)
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const handleCreateGroup = () => {
    const chatData = {
      token: token,
      data: {
        usersId: usersId,
        chat_name: groupName,
        chat_image: picture,
      }
    }
    setClick(true);
    dispatch(createaGroupChat(chatData));
  }

  const handleSelectPicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSnackBarClose = () => {
    setOpenSnackBar(false)
  }

  useEffect(() => {
        if(statusCreateGroup && click){
            if(statusCreateGroup == 200 ) {
                setStatus(true);
                setOpenSnackBar(true);
                setClick(false);
                stompClient.publish({
                  destination: '/app/broadcast-notification',
                  body: JSON.stringify({
                      receiverIds: usersId,
                      message: "You have been added to group"
                    }),
                  headers: { 
                      'content-type': 'application/json'
                  }
                });
                const timeoutId = setTimeout(() => handleNavigate(false), 2000);

                // Optional: Clear timeout if component unmounts early
                return () => clearTimeout(timeoutId);
            }else{
                if(click) {
                  setStatus(false);
                  setOpenSnackBar(true);
                  setClick(false);
                }
            }
        }
    },[statusCreateGroup])  
  return (
    <div className=' w-full h-full bg-[#f0f2f5] '>
        <div className='pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white'>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={() =>handleSetNewGroup(false)}/>
            <p className='cursor-pointer font-semibold text-xl '>Nhóm chat mới</p>
        </div>
        {/* update profile pic section */}
        <div className="flex flex-col justify-center items-center my-8">
        <label htmlFor="imgInput">
          <img
            src={
              picture ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtH3-0w5YZo8m01xHjGu3DbqJbLzjKODATcA&s'
            }
            className="rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer"
          />
        </label>
        <input type="file" id="imgInput" className="hidden" accept="image/*" onChange={handleSelectPicture} />
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
                  {loading ? (
                    <div className="bg-[#008069] rounded-full p-3">
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    </div>
                  ) : (
                    <BsArrowRight
                      className="text-white font-bold bg-[#008069] rounded-full p-1"
                      onClick={handleCreateGroup}
                    />
                  )}
            </div>
        </div>
        )}
      <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleSnackBarClose }
            >
                <Alert onClose={handleSnackBarClose } severity={status?'success':'error'} sx={{width:'100%'}}>{status?'Tạo nhóm thành công':'Tạo nhóm thất bại'}</Alert>
      </Snackbar>
    </div>
  )
}

export default NewGroup;