const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/auth');
const User = require('../../model/User');

router.get('/', Auth.auth,async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:'Server Error'});
    }
})

module.exports = router