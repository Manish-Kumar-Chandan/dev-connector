import React,{useState} from 'react'
import axios from 'axios';

export const Register = () => {
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
            return console.log('Passwords Do not  Match!')
        }else{
            const newUser={
                name, 
                email, 
                password
            };
            try {
                const config = {
                    header:{
                        'Content-Type':'aplication/json'
                    }
                }
                const res = await axios.post('/api/user', newUser, config);
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
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
                        minLength="6"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword} 
                        onChange={e => onChange(e)}
                        minLength="6"
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <a href="login.html">Sign In</a>
            </p>
        </>
    )
}
