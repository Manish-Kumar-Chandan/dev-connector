import React,{Fragment, useState} from 'react'
//import axios from 'axios';
import {connect} from 'react-redux';
import { Redirect } from 'react-router';
import {setAlert} from '../../actions/alert';
import PropTypes from 'prop-types';
import {register} from '../../actions/auth';

const Register = ({setAlert, register, isAuthenticated}) => {
    const [formdata, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const {name, email, password, confirmPassword}=formdata

    const onChange = e => setFormData({...formdata, [e.target.name]:e.target.value});
    const onSubmit = async e =>{
        e.preventDefault();
        if(password!==confirmPassword){
            setAlert('Passwords Do not  Match!', 'danger')
        }else{
            register({name, email, password});
            // const newUser={
            //     name, 
            //     email, 
            //     password
            // };
            // try {
            //     const config = {
            //         header:{
            //             'Content-Type':'aplication/json'
            //         }
            //     }
            //     const res = await axios.post('/api/user', newUser, config);
            //     console.log(res.data)
            // } catch (error) {
            //     console.log(error)
            // }
        }
    }

    if(isAuthenticated){
        return <Redirect to='/dashboard'/>
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)}  />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password} 
                        onChange={e => onChange(e)}
                        
                        
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword} 
                        onChange={e => onChange(e)}
                        
                        
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <a href="login.html">Sign In</a>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert:PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
}

const mapStateToProps = state=>({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(
   mapStateToProps, 
    {setAlert, register}
)(Register);
