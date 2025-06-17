import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/auth/Action';
import { MyButton } from '../components/Button';

const SignUp = () => {
    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [click, setClick] = useState(false);
    const [status, setStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isFill, setIsFill] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const { signup } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setFieldErrors({});
        if (inputPassword !== inputPasswordConfirm) {
            setMessage("Mật khẩu nhập lại không khớp");
            setFieldErrors({ passwordConfirm: true });
            setOpenSnackBar(true);
            setStatus(false);
            return;
        }

        dispatch(register({ full_name: inputName, email: inputEmail, password: inputPassword }));
        setClick(true);
        setLoading(true);
    };

    // Reset lỗi khi người dùng sửa
    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        setFieldErrors(prev => ({ ...prev, [field]: false }));
    };

    useEffect(() => {
        if (inputEmail && inputPassword && inputPasswordConfirm && inputName) {
            setIsFill("ok");
        } else {
            setIsFill("");
        }
    }, [inputEmail, inputPassword, inputPasswordConfirm, inputName]);

    useEffect(() => {
        if (signup && click) {
            const isSuccess = signup.status === 200;
            const passwordError = signup?.errors?.password;
            const emailError = signup?.errors?.email;
            const nameError = signup?.errors?.full_name;
            const errors = {};

            if (isSuccess) {
                setMessage("Đăng ký tài khoản thành công");
                setStatus(true);
                setOpenSnackBar(true);
                const timeout = setTimeout(() => navigate("/signin"), 2000);
                setClick(false);
                setLoading(false);
                return () => clearTimeout(timeout);
            } else {
                if(nameError === "size must be between 4 and 2147483647") {
                    setMessage("Tên phải hơn 3 kí tự");
                    errors.name = true;
                }else
                if (signup.message === "Email existed") {
                    setMessage("Email đã tồn tại");
                    errors.email = true;
                } else if (emailError === "Invalid email") {
                    setMessage("Email không hợp lệ");
                    errors.email = true;
                } else if (passwordError) {
                    setMessage("Mật khẩu phải có ít nhất 6 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt");
                    errors.password = true;
                } else {
                    setMessage("Đăng ký thất bại");
                }

                setStatus(false);
                setFieldErrors(errors);
                setOpenSnackBar(true);
                setClick(false);
                setLoading(false);
            }
        }
    }, [signup]);

    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    };

    return (
        <div className='bg-[#e8e9ec]'>
            <div className='flex justify-center h-screen items-center'>
                <div className='w-[30%] p-10 shadow-md bg-white'>
                    <h1 className='font-bold text-xl text-center'>ĐĂNG KÝ</h1>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p className='mb-2'>Chat name</p>
                            <input
                                placeholder='Nhập tên của bạn'
                                onChange={handleInputChange(setInputName, 'name')}
                                value={inputName}
                                type='text'
                                className={`p-2 border-2 ${fieldErrors.name ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
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
                        <div>
                            <p className='mb-2'>Nhập lại mật khẩu</p>
                            <input
                                placeholder='Nhập lại mật khẩu của bạn'
                                onChange={handleInputChange(setInputPasswordConfirm, 'passwordConfirm')}
                                value={inputPasswordConfirm}
                                type='password'
                                className={`p-2 border-2 ${fieldErrors.passwordConfirm ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
                        <div className='my-5 text-end'>
                            <p className='text-sm'>
                                Bạn đã có tài khoản?
                                <Link to="/signin" className='text-sm text-green-600 ml-1'>Đăng nhập</Link>
                            </p>
                        </div>
                        <div>
                            <MyButton text="Đăng ký" loading={loading} input={isFill} />
                        </div>
                    </form>
                </div>
            </div>
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity={status ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignUp;
