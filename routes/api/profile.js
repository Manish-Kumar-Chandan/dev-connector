const express = require('express');
const router = express.Router();
const Auth = require('../../middleware/auth');
const Profile = require('../../model/Profile');
const {check, validationResult} = require('express-validator');
const User = require('../../model/User');

//to get user profile 
router.get('/me', Auth.auth, async(req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.status(200).json(profile)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({msg:"Server Error"})
    }
})

//to create or update user Profile
router.post('/', [Auth.auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const{
        company, 
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twiter,
        instagram,
        linkedin
    }=req.body

    //Build profile object
    const profileField = {};
    profileField.user = req.user.id;
    if(company) profileField.company = company;
    if(website) profileField.website = website;
    if(location) profileField.location = location;
    if(bio) profileField.bio = bio;
    if(status) profileField.status = status;
    if(githubusername) profileField.githubusername = githubusername;
    if(skills) {
        profileField.skills = skills.split(',').map(skill=>skill.trim());
    }

    //Build social object
    profileField.social = {}
    if(youtube) profileField.social.youtube = youtube;
    if(facebook) profileField.social.facebook = facebook;
    if(twiter) profileField.social.twiter = twiter;
    if(instagram) profileField.social.instagram = instagram;
    if(linkedin) profileField.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user:req.user.id});
        //update the user profile
        if(profile){
            profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set: profileField}, {new:true}); 
            return res.status(200).json(profile)
        }
        profile = new Profile(profileField);
        await profile.save();
        res.json(profile)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error')
    }
})

//to get all user profiles
router.get('/', async(req, res)=>{
    try {
        let profile = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({msg:'Server error'})
    }
})

//to get user profile by id
router.get('/user/:user_id', async(req, res)=>{
    try {
        let profile = await Profile.findOne({user:req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile);
    } catch (error) {
        console.log(error.message);
        if(error.kind=='ObjectId'){
            return res.status(400).json({msg:'Profile for this user'})
        }
        res.status(500).send({msg:'Server error'})
    }
})

//delete user profile and user
router.delete('/', Auth.auth, async(req, res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});
        res.status(200).json({msg:'User Deleted'})
    } catch (error) {
        res.status(500).send({msg:'Server error'})
    }
})

//Add Experience to user profile
router.put('/experience', [Auth.auth, 
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id});
        if(!profile){
            return res.status(400).send({msg:'Please Create Profile first'})
        }
        profile.experience.unshift(newExp)
        await profile.save();
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).send({msg:'Server error'})
    }
})

//delete specfic experirnce from user profile
router.delete('/experience/:exp_id', Auth.auth, async(req, res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        if(removeIndex===-1){
            return res.status(400).send({msg:`There is no experience exits for ${req.params.exp_id}`})
        }
        profile.experience.splice(removeIndex, 1)
        
        await profile.save()
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).send({msg:'Server error'})
    }
})

//Add Education to user profile
router.put('/education', [Auth.auth, 
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
], async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id});
        if(!profile){
            return res.status(400).send({msg:'Please Create Profile first'})
        }
        profile.education.unshift(newEdu)
        await profile.save();
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).send({msg:'Server error'})
    }
})

//delete specfic education from user profile
router.delete('/education/:exp_id', Auth.auth, async(req, res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.exp_id);
        if(removeIndex===-1){
            return res.status(400).send({msg:`There is no education exits for ${req.params.exp_id}`})
        }
        profile.education.splice(removeIndex, 1)
        
        await profile.save()
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).send({msg:'Server error'})
    }
})

module.exports = router