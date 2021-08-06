const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const User = require('../../model/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
        return res.status(400).send({error:errors.array()});
    }
    try {
        //see if user exists
        let user = await User.findOne({email});
        if(user){
            res.status(400).send({error:[{msg:"User already exists"}] })
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
        
        return res.status(200).send({msg:"User Register Successfully"});
    } catch (error) {
        return res.status(324).send({error:error.message})
    }
})

module.exports = router