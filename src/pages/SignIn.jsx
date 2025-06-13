import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser, login } from '../redux/auth/Action';
import { MyButton } from '../components/Button';

const SignIn = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [status, setStatus] = useState(true);
    const [click, setClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isFill, setIsFill] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    
    const { signin } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setFieldErrors({});
        dispatch(login({ email: inputEmail, password: inputPassword }));
        setClick(true);
        setLoading(true);
        setStatus(true);
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setFieldErrors(prev => ({ ...prev, [field]: false }));
    };

    useEffect(() => {
        if (inputEmail && inputPassword) {
            setIsFill("ok");
        } else {
            setIsFill("");
        }
    }, [inputEmail, inputPassword]);

    useEffect(() => {
        if (!click || !signin) return;

        const isSuccess = signin.status === 200;
        const errors = {};

        if (isSuccess) {
            localStorage.setItem("token", signin.token);
            setMessage("Đăng nhập thành công");
            setLoading(false);
            setStatus(true);
            setOpenSnackBar(true);
            dispatch(currentUser(signin.token));
            const timeoutId = setTimeout(() => navigate("/", { replace: true }), 2000);
            return () => clearTimeout(timeoutId);
        } else {
            if (signin.message === "Wrong password") {
                setMessage("Mật khẩu không chính xác");
                errors.password = true;
            } else if (signin.message === "Email not found") {
                setMessage("Email không tồn tại");
                errors.email = true;
            } else {
                setMessage("Đăng nhập thất bại");
            }

            setFieldErrors(errors);
            setStatus(false);
            setLoading(false);
            setOpenSnackBar(true);
        }
    }, [signin, click, dispatch, navigate]);

    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    };

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
                                onChange={handleInputChange(setInputEmail, 'email')}
                                value={inputEmail}
                                type='text'
                                className={`p-2 border-2 ${fieldErrors.email ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
                        <div>
                            <p className='mb-2'>Mật khẩu</p>
                            <input
                                placeholder='Nhập mật khẩu của bạn'
                                onChange={handleInputChange(setInputPassword, 'password')}
                                value={inputPassword}
                                type='password'
                                className={`p-2 border-2 ${fieldErrors.password ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
                        <div className='text-end'>
                            <Link to="/forget-password" className='text-sm text-green-600'>Quên mật khẩu?</Link>
                            <p className='text-sm pt-1'>
                                Bạn chưa có tài khoản?
                                <Link to="/signup" className='text-sm text-green-600 ml-1'>Đăng ký</Link>
                            </p>
                        </div>
                        <div>
                            <MyButton text={"Đăng nhập"} loading={loading} input={isFill} />
                        </div>
                    </form>
                </div>
            </div>

            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert onClose={handleSnackBarClose} severity={status ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignIn;
