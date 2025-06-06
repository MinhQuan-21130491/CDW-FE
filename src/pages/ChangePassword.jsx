import { Alert, Button, Snackbar } from '@mui/material'
import { green } from '@mui/material/colors';
import{ useEffect, useRef, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../redux/user/action';
import { useDispatch, useSelector } from 'react-redux';

export const ChangePassword = () => {
    const[openSnackBar, setOpenSnackBar] = useState();
    const[inputCurrentPw, setInputCurrentPw] = useState();
    const[inputPw, setInputPw] = useState();
    const[inputConfirmPw, setInputConfirmPw] = useState();
    const[messageAlert, setMessageAlert] = useState();
    const{message, error} = useSelector(state => state.user);
    const[click, setClick] = useState(false);
    const status = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSnackBarClose = () => {
        setOpenSnackBar(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(inputPw != inputConfirmPw) {
            setMessageAlert("Mật khẩu nhập lại không khớp")
            status.current = false;
            setOpenSnackBar(true);
        }
        dispatch(changePassword({token: token, request: {oldPassword: inputCurrentPw, newPassword: inputPw}}))
        setClick(true)
      }
    const handleOnchangeCurrentPw = (e) => {
        setInputCurrentPw(e.target.value)
    }
    const handleOnchagePw = (e) => {
        setInputPw(e.target.value)
    }
    const handleOnchageConfirmPw = (e) => {
        setInputConfirmPw(e.target.value)
    }

    useEffect(() => {
        let timeout;
        if(error === "Wrong password") {
            setMessageAlert("Mật khẩu hiện tại không chính xác")
            status.current = false;
            setOpenSnackBar(true);
            setClick(false);
        }else if(error === "Mật khẩu phải có ít nhất 6 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt") {
            setMessageAlert("Mật khẩu phải có ít nhất 6 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt")
            status.current = false;
            setOpenSnackBar(true);
            setClick(false);
        }else if(message === "Change password successful" && click){
            setMessageAlert("Thay đổi mật khẩu thành công")
            status.current = true;
            setOpenSnackBar(true);
            setClick(false);
            setInputCurrentPw("");
            setInputPw("");
            setInputConfirmPw("");
            timeout = setTimeout(() => {
                navigate(-1);
            }, 3000)
        }
        return () => clearTimeout(timeout);
    }, [message, error, click])
  return (
    <div className='bg-[#e8e9ec]'>
        <div className='flex justify-center h-screen items-center relative'>
            <IoMdArrowBack className='absolute top-10 left-10 text-2xl cursor-pointer' onClick={() => navigate(-1)}/>
            <div className='w-[30%] p-10 pt-4 shadow-md bg-white '>
                <h1 className='font-bold text-xl text-center'>Đổi mật khẩu</h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <p className='mb-2'>Mật khẩu hiện tại</p>
                        <input 
                        placeholder='Nhập mật khẩu hiện tại'
                        onChange={handleOnchangeCurrentPw}
                        value={inputCurrentPw}
                        type='password' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                    <div>
                        <p className='mb-2'>Mật khẩu mới</p>
                        <input 
                        placeholder='Nhập mật khẩu mới'
                        onChange={handleOnchagePw}
                        value={inputPw}
                        type='password' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
                    </div>
                    <div>
                        <p className='mb-2'>Nhập lại mật khẩu mới</p>
                        <input 
                        placeholder='Nhập lại mật khẩu mới'
                        onChange={handleOnchageConfirmPw}
                        value={inputConfirmPw}
                        type='password' className='p-2 border-2 border-green-600 outline-none w-full rounded-md' />
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
            <Alert onClose={handleSnackBarClose } severity={status.current?'success':'error'} sx={{width:'100%'}}>{messageAlert}</Alert>
        </Snackbar>
    </div>
  )
}
