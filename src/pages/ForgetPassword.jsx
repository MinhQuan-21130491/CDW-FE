import { Alert, Button, CircularProgress, Snackbar } from '@mui/material'
import { green } from '@mui/material/colors';
import{ useEffect, useRef, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from '../redux/user/action';
import { MyButton } from '../components/Button';

export const ForgetPassword = () => {
    const[openSnackBar, setOpenSnackBar] = useState();
    const[inputEmail, setInputEmail] = useState("");
    const status = useRef();
    const navigate = useNavigate();
    const{message, error, loading} = useSelector(state => state.user);
    const[messageAlert, setMessageAlert] = useState();
    const[click, setClick] = useState(false);
    const dispatch = useDispatch();
    const handleSnackBarClose = () => {
        setOpenSnackBar(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(inputEmail === "") {
            setMessageAlert("Vui lòng nhập email")
            status.current = false;
            setOpenSnackBar(true);
        }
        dispatch(forgetPassword({request:{email: inputEmail}}));
        setClick(true)
      }
    const handleOnChangeEmail = (e) => {
        setInputEmail(e.target.value);
    }
    useEffect(() => {
        if(error ==="invalid email" && click) {
            setMessageAlert("Email không hợp lệ")
            status.current = false;
            setOpenSnackBar(true);
            setClick(false);
        }else if(error === "Email not existed" && click) {
            setMessageAlert("Email không tồn tại trong hệ thống")
            status.current = false;
            setOpenSnackBar(true);
            setClick(false);
        }else if(message === "Send new password to your email successfully" && click) {
            setMessageAlert("Mật khẩu mới đã được tới email của bạn");
            status.current = true;
            setOpenSnackBar(true);
            setClick(false);
        }
    }, [message,error, click])
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
                     <MyButton  text = {"Xác nhận"} loading = {loading} input={inputEmail}/>
                    </div>
                </form>
            </div>
        </div>
        <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleSnackBarClose }
        >
            <Alert onClose={handleSnackBarClose } severity={status.current?'success':'error'} sx={{width:'100%'}}>{messageAlert}</Alert>
        </Snackbar>
    </div>
  )
}
