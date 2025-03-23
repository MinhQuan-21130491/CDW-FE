import { Alert, Button, Snackbar } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const SignUp = () => {
    const[inputEmail, setInputEmail] = useState('');
    const[inputPassword, setInputPassword] = useState('');
    const[inputPasswordConfirm, setInputPasswordConfirm] = useState('');
    const[openSnackBar, setOpenSnackBar] = useState();

    const handleSubmit = () => {
        e.preventDefault();
        console.log('submit');
        setOpenSnackBar(true)
    }
    const handleOnchangeEmail =(e) => {
        setInputEmail(e.value)
    }
    const handleOnchangePassword =(e) => {
        setInputPassword(e.value)
    }
    const handleOnchangePasswordConfirm =(e) => {
        setInputPasswordConfirm(e.value)
    }
    const handleSnackBarClose = () => {
        setOpenSnackBar(false)
    }
  return (
    <div className='bg-[#e8e9ec]'>
        <div className='flex justify-center h-screen items-center'>
            <div className='w-[30%] p-10 shadow-md bg-white'>
                <h1 className='font-bold text-xl text-center'>ĐĂNG KÝ</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <p className='mb-2'>Email</p>
                        <input 
                        placeholder='Nhập email của bạn'
                        onChange={handleOnchangeEmail}
                        value={inputEmail}
                        type='text' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                    <div>
                        <p className='mb-2'>Mật khẩu</p>
                        <input 
                        placeholder='Nhập mật khẩu của bạn'
                        onChange={handleOnchangePassword}
                        value={inputPassword}
                        type='password' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                    <div>
                        <p className='mb-2'>Nhập lại mật khẩu</p>
                        <input 
                        placeholder='Nhập lại mật khẩu của bạn'
                        onChange={handleOnchangePasswordConfirm}
                        value={inputPasswordConfirm}
                        type='password' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                </form>
                <div className='my-5 text-end'>
                    <p className='text-sm '>Bạn đã có tài khoản?<Link to="/signin" className='text-sm text-green-600'>Đăng nhập</Link></p>
                </div>
                <div >
                    <Button type='submit' sx={{bgcolor:green[500]}} className='w-full bg-green-600' variant='contained'>Đăng ký</Button>
                </div>
            </div>
        </div>
         <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleSnackBarClose}
        >
            <Alert onClose={handleSnackBarClose } severity='success' sx={{width:'100%'}}>This is success message!</Alert>
        </Snackbar>
    </div>
  )
}

export default SignUp