import {REGISTER_SUCCESS, REGISTER_FAIL} from './types';
import axios from 'axios';
import { setAlert } from './alert';

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