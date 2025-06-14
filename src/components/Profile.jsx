import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight, BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/auth/Action';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { avatar_default } from '../assets'

  export default function Profile({ handleNavigate, user, onUpdateUser}) {
    const [flag, setFlag] = useState(false);
    const [username, setUsername] = useState(user?.full_name);
    const [picture, setPicture] = useState(user?.profile_picture);
    const[openSnackBar, setOpenSnackBar] = useState(false);
    const[status, setStatus] = useState(false );
    const{update} = useSelector(state => state.auth);
    const[click, setClick] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSelectPicture = (event) => {
      const file = event.target.files[0];
      if (file) {
        if(file.size < 1 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPicture(reader.result);
          };
          reader.readAsDataURL(file);
          setClick(false);
        }else {
          // xử lý lỗi sau
        }
      }
    };
    const handleUpdateUser = () => {
      const updateRequest = {
        token: localStorage.getItem('token'),
        full_name: username,
        profile_picture: picture,
      }
      dispatch(updateUser(updateRequest));
      setClick(true);
      setFlag(false);
      setLoading(true);

    }
    const handleSnackBarClose = () => {
      setOpenSnackBar(false)
    }
  useEffect(() => {
        if(click && update){
            if(update?.status == 200) {
                onUpdateUser();
                setStatus(true);
                setOpenSnackBar(true)
                setLoading(false);
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
          {picture ==="" ? (
                      <div className='text-center cursor-pointer'>
                        <div className=" w-[12vw] h-[12vw] rounded-full bg-white flex items-center justify-center mb-5">
                            <BiSolidImageAdd className="text-[#008069]" size={40} />
                        </div>
                        <span className='p-2 px-4 text-[#008069] border-[#008069] border-[1px] rounded-md'>Chọn ảnh</span>
                      </div>
                      
                    ): (
                      <div className='text-center cursor-pointer'>
                        <img
                          src={
                            picture ||
                            avatar_default
                          }
                          className="rounded-full w-[12vw] h-[12vw] object-cover cursor-pointer mb-5"
                        />
                        <span className='p-2 px-4 text-[#008069] border-[#008069] border-[1px] rounded-md'>Chọn ảnh</span>
                      </div>
                    )}
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
            <div className={`${!loading ? 'bg-[#008069]' : 'bg-gray-400'} rounded-full p-2 w-12 h-12 flex items-center justify-center`}>
              {loading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                <BsArrowRight
                  onClick={handleUpdateUser}
                  color='white'    
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
          <Alert onClose={handleSnackBarClose } severity={status?'success':'error'} sx={{width:'100%'}}>{status?'Thay đổi thông tin thành công!':'Thay đổi thông tin thất bại!'}</Alert>
      </Snackbar>
    </div>
  );
}