import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser, login } from '../redux/auth/Action';
import { MyButton } from '../components/Button';
import LanguageSwitch from '../components/LanguageSwitch';
import { useTranslation } from 'react-i18next';

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
    const {t} = useTranslation();
    
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
            setMessage(t('success_login'));
            setLoading(false);
            setStatus(true);
            setOpenSnackBar(true);
            dispatch(currentUser(signin.token));
            const timeoutId = setTimeout(() => navigate("/", { replace: true }), 2000);
            return () => clearTimeout(timeoutId);
        } else {
            if (signin.message === "error_wrong_password") {
                setMessage(t('error_wrong_password'));
                errors.password = true;
            } else if (signin.message === "Email not found") {
                setMessage(t('error_email_not_found'));
                errors.email = true;
            } else {
                setMessage(t('error_error_login'));
                errors.password = true;
                errors.email = true;
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
            <div className='absolute  top-2 right-4'>
                <LanguageSwitch />
            </div>
            <div className='flex justify-center h-screen items-center'>
                <div className='w-[30%] p-10 shadow-md bg-white'>
                    <h1 className='font-bold text-xl text-center'>{t('login_title')}</h1>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p className='mb-2'>{t('email')}</p>
                            <input
                                placeholder={t('placeholder_email')}
                                onChange={handleInputChange(setInputEmail, 'email')}
                                value={inputEmail}
                                type='text'
                                className={`p-2 border-2 ${fieldErrors.email ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
                        <div>
                            <p className='mb-2'>{t('password')}</p>
                            <input
                                placeholder={t('placeholder_password')}
                                onChange={handleInputChange(setInputPassword, 'password')}
                                value={inputPassword}
                                type='password'
                                className={`p-2 border-2 ${fieldErrors.password ? 'border-red-600' : 'border-green-600'} outline-none w-full rounded-md`}
                            />
                        </div>
                        <div className='text-end'>
                            <Link to="/forget-password" className='text-sm text-green-600'>{t('forget_pw')}</Link>
                            <p className='text-sm pt-1'>
                               {t('dont_have_account')}
                                <Link to="/signup" className='text-sm text-green-600 ml-1'>{t('signup')}</Link>
                            </p>
                        </div>
                        <div>
                            <MyButton text={t('login')} loading={loading} input={isFill} />
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
