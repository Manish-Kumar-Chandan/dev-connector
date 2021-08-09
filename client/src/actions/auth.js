import {
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOAD, AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAILED,
    LOG_OUT
} from './types';
import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

//load user
export const loadUser = ()=> async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOAD,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//register user
export const register = ({name ,email, password }) => async dispatch =>{
    const newUser={
        name, 
        email, 
        password
    }
    try {
        const config = {
            header:{
                'Content-Type':'aplication/json'
            }
        }
        const res = await axios.post('/api/user', newUser, config);
        console.log(res.data)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (error) {
        console.log(error.response.data)
        const errors = error.response.data.error;
        if(errors){
            errors.forEach(err=>dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

// login user
export const login=({email, password})=>async dispatch=> {
    const loginUser={
        email,
        password
    }
    try {
        const config = {
            header:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.post('/api/auth', loginUser, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (error) {
        const errors= error.response.data.error
        if(errors){
            errors.forEach(err=>dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAILED
        })
    }
}

//logout 
export const logout = ()=>dispatch=>{
    dispatch({type:LOG_OUT})
}