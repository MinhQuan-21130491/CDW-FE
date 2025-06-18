import { Alert, Button, Snackbar } from '@mui/material'
import { green } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom'
import { changePassword, resetError, resetMessage } from '../redux/user/action'
import { useDispatch, useSelector } from 'react-redux'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import LanguageSwitch from '../components/LanguageSwitch'

export const ChangePassword = () => {
    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [inputCurrentPw, setInputCurrentPw] = useState("")
    const [inputPw, setInputPw] = useState("")
    const [inputConfirmPw, setInputConfirmPw] = useState("")
    const [messageAlert, setMessageAlert] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const { message, error } = useSelector(state => state.user)

    const [errorCurrentPw, setErrorCurrentPw] = useState(false)
    const [errorNewPw, setErrorNewPw] = useState(false)
    const [errorConfirmPw, setErrorConfirmPw] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
    const {t} = useTranslation();
    const handleSnackBarClose = () => setOpenSnackBar(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        setErrorCurrentPw(false)
        setErrorNewPw(false)
        setErrorConfirmPw(false)

        if (inputPw !== inputConfirmPw) {
            setMessageAlert("Mật khẩu nhập lại không khớp")
            setErrorConfirmPw(true)
            setIsSuccess(false)
            setOpenSnackBar(true)
            return
        }

        const token = localStorage.getItem("token")
        dispatch(changePassword({
            token: token,
            request: {
                oldPassword: inputCurrentPw,
                password: inputPw
            }
        }))
    }

    useEffect(() => {
        if (error) {
            const errorPw = error?.errors?.password
            if (error.message === "error_wrong_password") {
                setMessageAlert(t('error_wrong_password'))
                setErrorCurrentPw(true)
                dispatch(resetError());
            } else if (errorPw) {
                setMessageAlert(t('error_password_partern'))
                setErrorNewPw(true)
                dispatch(resetError());
            } else {
                setMessageAlert(t('error_error_change_pw'))
                dispatch(resetError())
            }
            setIsSuccess(false)
            setOpenSnackBar(true)
        } else if (message === "success_change_password") {
            setMessageAlert(t('success_change_password'))
            setIsSuccess(true)
            setOpenSnackBar(true)
            // Reset form
            setInputCurrentPw("")
            setInputPw("")
            setInputConfirmPw("")
            dispatch(resetMessage())
            setTimeout(() => {
                navigate("/")
            }, 3000)
        }
    }, [message, error, navigate])

    useEffect(() => {
        if (inputCurrentPw && inputPw && inputConfirmPw) {
            setIsSubmitDisabled(false)
        } else {
            setIsSubmitDisabled(true)
        }
    }, [inputCurrentPw, inputPw, inputConfirmPw])

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
                <div className='w-[30%] p-10 pt-4 shadow-md bg-white '>
                    <h1 className='font-bold text-xl text-center'>{t('change_pw_title')}</h1>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='pt-4'>
                            <p className='mb-2'>{t('current_pw')}</p>
                            <input
                                placeholder={t('placeholder_current_pw')}
                                onChange={(e) => {
                                    setInputCurrentPw(e.target.value)
                                    setErrorCurrentPw(false)
                                }}
                                value={inputCurrentPw}
                                type='password'
                                className={`p-2 border-2 outline-none w-full rounded-md ${errorCurrentPw ? 'border-red-600' : 'border-green-600'}`}
                            />
                        </div>
                        <div>
                            <p className='mb-2'>{t('new_pw')}</p>
                            <input
                                placeholder={t('placeholder_new_pw')}
                                onChange={(e) => {
                                    setInputPw(e.target.value)
                                    setErrorNewPw(false)
                                }}
                                value={inputPw}
                                type='password'
                                className={`p-2 border-2 outline-none w-full rounded-md ${errorNewPw ? 'border-red-600' : 'border-green-600'}`}
                            />
                        </div>
                        <div>
                            <p className='mb-2'>{t('confirm_new_pw')}</p>
                            <input
                                placeholder={t('placeholder_confirm_new_pw')}
                                onChange={(e) => {
                                    setInputConfirmPw(e.target.value)
                                    setErrorConfirmPw(false)
                                }}
                                value={inputConfirmPw}
                                type='password'
                                className={`p-2 border-2 outline-none w-full rounded-md ${errorConfirmPw ? 'border-red-600' : 'border-green-600'}`}
                            />
                        </div>
                        <Button
                            type='submit'
                            sx={{ bgcolor: green[500] }}
                            className='w-full bg-green-600'
                            variant='contained'
                            disabled={isSubmitDisabled}
                        >
                            {t('confirm')}
                        </Button>
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
                    severity={isSuccess ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {messageAlert}
                </Alert>
            </Snackbar>
        </div>
    )
}
