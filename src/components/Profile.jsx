import React, { useEffect, useState } from 'react';
import { BsArrowLeft, BsCheck2, BsPencil } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/auth/Action';
import { Alert, Button, Snackbar } from '@mui/material';

  export default function Profile({ handleNavigate, user, onUpdateUser}) {
    const [flag, setFlag] = useState(false);
    const [username, setUsername] = useState(user?.full_name);
    const [picture, setPicture] = useState(user?.profile_picture);
    const[openSnackBar, setOpenSnackBar] = useState(false);
    const[status, setStatus] = useState(false );
    const{update} = useSelector(state => state.auth);
    const[click, setClick] = useState(false)
    const dispatch = useDispatch();

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
    const handleUpdateUser = () => {
      const updateRequest = {
        token: localStorage.getItem('token'),
        full_name: username,
        profile_picture: picture,
      }
      dispatch(updateUser(updateRequest));
      setClick(true)
      setFlag(false)
    }
    const handleSnackBarClose = () => {
      setOpenSnackBar(false)
    }
  useEffect(() => {
        if(click && update){
            if(update?.status == 200) {
                onUpdateUser();
                setStatus(true)
                setOpenSnackBar(true)
            }else{
                setStatus(false)
                setOpenSnackBar(true)
            }
        }
    },[update])
  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="pb-3 pl-3 pt-20 flex items-center space-x-4 bg-[#008069] text-white">
        <BsArrowLeft className="cursor-pointer text-2xl font-bold" onClick={() => handleNavigate(false)} />
        <p className="cursor-pointer font-semibold text-xl">Thông tin cá nhân</p>
      </div>

      {/* Cập nhật ảnh đại diện */}
      <div className="flex flex-col justify-center items-center my-8">
        <label htmlFor="imgInput">
          <img
            src={
              picture ||
              'https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg'
            }
            className="rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer"
          />
        </label>
        <input type="file" id="imgInput" className="hidden" accept="image/*" onChange={handleSelectPicture} />
      </div>

      {/* Chỉnh sửa họ tên */}
      <div className="px-3 bg-white">
        <p className="pt-3 font-semibold">Họ tên</p>
        {flag ? (
          <div className="flex items-center justify-between">
            <input
              className="w-[80%] outline-none border-b-2 border-blue-700 mt-2 pb-1 mb-3"
              type="text"
              placeholder="Nhập tên mới"
              onChange={(e) => setUsername(e.target.value)}
              value={username || ''}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="py-3">{username || 'Chip'}</p>
            <BsPencil className="cursor-pointer" onClick={() => setFlag(true)} />
          </div>
        )}
      </div>

      {/* Hiển thị nút lưu nếu có thay đổi */}
      {(picture !== user?.profile_picture || username !== user?.full_name) && !click && (
        <div className="fixed md:w-[350px] sm:w-[100px] bottom-[2.15rem] py-10 flex items-center justify-center text-5xl cursor-pointer">
          <div onClick={handleUpdateUser}>
            <FaCheck className="text-white font-bold bg-[#008069] rounded-full p-1" />
          </div>
        </div>
      )}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose }
      >
          <Alert onClose={handleSnackBarClose } severity={status?'success':'error'} sx={{width:'100%'}}>{status?'Thay đổi thông tin thành công!':'Thay đổi thông tin thất bại!'}</Alert>
      </Snackbar>
    </div>
  );
}