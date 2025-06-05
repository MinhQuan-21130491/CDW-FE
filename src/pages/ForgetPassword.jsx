import { Alert, Button, Snackbar } from '@mui/material'
import { green } from '@mui/material/colors';
import{ useRef, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

export const ForgetPassword = () => {
    const[openSnackBar, setOpenSnackBar] = useState();
    const[inputEmail, setInputEmail] = useState();
    const status = useRef();
    const navigate = useNavigate();
    const handleSnackBarClose = () => {
        setOpenSnackBar(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setClick(true)
      }
    const handleOnChangeEmail = () => {
        
    }
 
  return (
    <div className='bg-[#e8e9ec]'>
        <div className='flex justify-center h-screen items-center relative'>
            <IoMdArrowBack className='absolute top-10 left-10 text-2xl cursor-pointer' onClick={() => navigate(-1)}/>
            <div className='w-[30%] p-10 pt-4 shadow-md bg-white '>
                <h1 className='font-bold text-xl text-center'>Quên mật khẩu</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <p className='mb-2 text-md text-center'>Nhập email đăng ký tài khoản và mật khẩu mới sẽ được gửi về email trong vòng 1-2 phút.</p>
                        <input 
                        placeholder='Nhập email của bạn'
                        onChange={handleOnChangeEmail}
                        value={inputEmail}
                        type='text' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                   
                    <div className='my-5 text-end'>
                    </div>
                    <div >
                        <Button type='submit' sx={{bgcolor:green[500]}} className='w-full bg-green-600' variant='contained'>Xác nhận</Button>
                    </div>
                </form>
            </div>
        </div>
        <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleSnackBarClose }
        >
            <Alert onClose={handleSnackBarClose } severity={status?'success':'error'} sx={{width:'100%'}}>{status?'Đổi mật khẩu thành công!':'Đổi mật khẩu thất bại!'}</Alert>
        </Snackbar>
    </div>
  )
}
