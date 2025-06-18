import { Alert, Snackbar } from '@mui/material';
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from '../redux/user/action';
import { MyButton } from '../components/Button';
import { useEffect, useRef, useState } from 'react';
import LanguageSwitch from '../components/LanguageSwitch';
import { useTranslation } from 'react-i18next';

export const ForgetPassword = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [inputEmail, setInputEmail] = useState("");
    const [messageAlert, setMessageAlert] = useState("");
    const [click, setClick] = useState(false);
    const [hasError, setHasError] = useState(false); // ✅ trạng thái lỗi
    const status = useRef(false); // true: success, false: error
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message, error, loading } = useSelector(state => state.user);
    const {t} = useTranslation();
    const handleSnackBarClose = () => setOpenSnackBar(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputEmail.trim() === "") {
            setMessageAlert(t('error_blank_field_email'));
            status.current = false;
            setOpenSnackBar(true);
            return;
        }

        dispatch(forgetPassword({ request: { email: inputEmail } }));
        setClick(true);
    };

    const handleOnChangeEmail = (e) => {
        setInputEmail(e.target.value);
        setHasError(false); // ✅ Reset lỗi khi gõ lại
    };

    useEffect(() => {
        if (!click) return;

        const emailError = error?.errors?.email;
        let timeOut;
        if (emailError === "error_invalid_email") {
            setMessageAlert(t('error_invalid_email'));
            status.current = false;
            setHasError(true);
        } else if (error?.message === "error_email_not_existed") {
            setMessageAlert(t('error_email_not_existed'));
            status.current = false;
            setHasError(true);
        } else if (message === "successs_send") {
            setMessageAlert(t('successs_send'));
            status.current = true;
            setHasError(false);
            timeOut = setTimeout(() => {
                navigate("/signin");
            }, 3000)
            } else {
            setClick(false);
            return;
        }
        
        setOpenSnackBar(true);
        setClick(false);
        return () => clearTimeout(timeOut);
    }, [message, error]);

    return (
        <div className='bg-[#e8e9ec]'>
            <div className='absolute top-2 right-4 z-10'>
                <LanguageSwitch />
            </div>
            <div className='flex justify-center h-screen items-center relative'>
                <IoMdArrowBack
                    className='absolute top-10 left-10 text-2xl cursor-pointer'
                    onClick={() => navigate(-1)}
                />
                <div className='w-[35%] p-10 pt-4 shadow-md bg-white'>
                    <h1 className='font-bold text-xl text-center'>{t('forget_pw_title')}</h1>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p className='mb-2 text-md text-center'>
                               {t("text_forget_pw")}
                            </p>
                            <input
                                placeholder={t('placeholder_email')}
                                onChange={handleOnChangeEmail}
                                value={inputEmail}
                                type='text'
                                className={`p-2 border-2 outline-none w-full rounded-md 
                                    ${hasError ? 'border-red-600' : 'border-green-600'}`}
                            />
                        </div>
                        <div>
                            <MyButton text={t('confirm')} loading={loading} input={inputEmail} />
                        </div>
                    </form>
                </div>
            </div>

            <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
            >
                <Alert
                    onClose={handleSnackBarClose}
                    severity={status.current ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {messageAlert}
                </Alert>
            </Snackbar>
        </div>
    );
};
