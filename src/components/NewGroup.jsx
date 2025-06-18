import React, { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight, BsCheck2, BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { BiSolidImageAdd } from "react-icons/bi";
import { createaGroupChat } from '../redux/chat/action';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  const[messageAlert, setMessageAlert] = useState();
  const {t} = useTranslation();
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
                setMessageAlert(t('success_create_group'));
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
                  setMessageAlert(t('error_create_group'));
                }
            }
        }
    },[statusCreateGroup])  
  return (
    <div className=' w-full h-full bg-[#f0f2f5] '>
        <div className='pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white'>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' onClick={() =>handleSetNewGroup(false)}/>
            <p className='cursor-pointer font-semibold text-xl '>{t('new_group')}</p>
        </div>
        {/* update profile pic section */}
        <div className="flex flex-col justify-center items-center my-8">
        <label htmlFor="imgInput">
          {picture ==="" ? (
            <div className='text-center cursor-pointer'>
              <div className=" w-[12vw] h-[12vw] rounded-full bg-white flex items-center justify-center mb-5">
                  <BiSolidImageAdd className="text-[#008069]" size={40} />
              </div>
              <span className='p-2 px-4 text-[#008069] border-[#008069] border-[1px] rounded-md'>{t('pick_image')}</span>
            </div>
            
          ): (
            <div className='text-center cursor-pointer'>
              <img
                src={
                  picture ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtH3-0w5YZo8m01xHjGu3DbqJbLzjKODATcA&s'
                }
                className="rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer mb-5"
              />
              <span className='p-2 px-4 text-[#008069] border-[#008069] border-[1px] rounded-md'>{t('pick_image')}</span>
            </div>
          )}
         
          
        </label>
        <input type="file" id="imgInput" className="hidden" accept="image/*" onChange={handleSelectPicture} />
      </div>

        {/* name section */}
        <div className='px-3 bg-white'>
            <p className='pt-3 font-semibold'>{t('group_name')}</p>  
          <div className='flex items-center justify-between' >
              <input
                className='w-[100%] outline-none border-b-2 border-green-600 mt-2 pb-1 mb-3' 
                type='text' 
                placeholder={t('placeholder_group_name')}
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                />
            </div>
        </div>
        {groupName &&(
        <div className='fixed md:w-[350px] sm:w-[100px] bottom-[2.15rem] py-10 bg-slate-200 items-center justify-center flex text-5xl cursor-pointer'>
                <div onClick={() => {
                }}>
                  <div className={`${!loading ? 'bg-[#008069]' : 'bg-gray-400'} rounded-full p-2 w-12 h-12 flex items-center justify-center`}>
                    {loading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : (
                      <BsArrowRight
                        onClick={handleCreateGroup}
                        color='white'
                        
                      />
                    )}
                  </div>

            </div>
        </div>
        )}
      <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleSnackBarClose }
            >
                <Alert onClose={handleSnackBarClose } severity={status?'success':'error'} sx={{width:'100%'}}>{messageAlert}</Alert>
      </Snackbar>
    </div>
  )
}

export default NewGroup;