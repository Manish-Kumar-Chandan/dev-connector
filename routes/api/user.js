const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const User = require('../../model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/',
[
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email')
    .isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
],
 async(req, res)=>{
    const {name, email, password}=req.body; 
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    try {
        //see if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({error:[{msg:"User already exists"}] })
        }
        
        //get users gravatar
        const avatar = gravatar.url(email, {
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email, 
            avatar,
            password
        })
        
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        //return jsonwebtoken
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'),{expiresIn:3600},(err, token)=>{
            if(err) throw err
            res.json({token})
        })
        
        //return res.status(200).json({msg:"User Register Successfully"});
    } catch (error) {
        return res.status(324).json({error:error.message})
    }
})

module.exports = router