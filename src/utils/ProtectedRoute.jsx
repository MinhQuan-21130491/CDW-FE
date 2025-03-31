import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { currentUser } from "../redux/auth/Action";
import { Navigate } from "react-router-dom";

//goi component nay truoc khi vo component khac
const ProtectedRoute = ({children}) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    useEffect(() => {
        if(token) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch])
    return token ? children : <Navigate to ='/signin' />
}
export default ProtectedRoute;