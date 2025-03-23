import { Alert, Button, Snackbar } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const SignIn = () => {
    const[inputEmail, setInputEmail] = useState('');
    const[inputPassword, setInputPassword] = useState('');
    const[openSnackBar, setOpenSnackBar] = useState();
    const handleSubmit = (e) => {
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
    const handleSnackBarClose = () => {
        setOpenSnackBar(false)
    }
  return (
    <div className='bg-[#e8e9ec]'>
        <div className='flex justify-center h-screen items-center'>
            <div className='w-[30%] p-10 shadow-md bg-white'>
                <h1 className='font-bold text-xl text-center'>ĐĂNG NHẬP</h1>
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
                    <div className='my-5 text-end'>
                    <p className='text-sm '>Bạn chưa có tài khoản? <Link to="/register" className='text-sm text-green-600'>Đăng ký</Link></p>
                    </div>
                    <div >
                        <Button type='submit' sx={{bgcolor:green[500]}} className='w-full bg-green-600' variant='contained'>Đăng nhập</Button>
                    </div>
                </form>
            </div>
        </div>
        <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleSnackBarClose }
        >
            <Alert onClose={handleSnackBarClose } severity='success' sx={{width:'100%'}}>This is success message!</Alert>
        </Snackbar>
    </div>
  )
}

export default SignIn