const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Post = require('../../model/Post');
const User = require('../../model/User');

//Create Post
router.post('/',
[Auth.auth,check('text', 'Text is required').not().isEmpty()], 
async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
    const user = await User.findById(req.user.id).select('-password');        
    const newPost=new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id,
    })
    const post = await newPost.save();
    res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:'Server Error'});
    }
})

module.exports = router