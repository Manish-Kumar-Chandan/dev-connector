const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/auth');
const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');

router.get('/', Auth.auth,async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Server Error'});
    }
})

//Login
router.post('/',
[
    check('email', 'Please include a valid email')
    .isEmail(),
    check('password', 'Password is Required').exists()
],
 async(req, res)=>{
    const {email, password}=req.body; 
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    try {
        //finding user
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:[{msg:"Invalid Credentials"}] });
        }
        
        //matching password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({error:[{msg:"Invalid Credentials"}] });
        }

        //return jsonwebtoken
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'),{expiresIn:36000},(err, token)=>{
            if(err) throw err
            res.json({token})
        })
        
        //return res.status(200).json({msg:"Login Successfully"});
    } catch (error) {
        return res.status(324).json({error:error.message})
    }
})

module.exports = router