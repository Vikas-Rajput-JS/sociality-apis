const Posts = require('../Model/Post')
const VerifyUser = require('../MiddleWare/Auth')
const Router = require('express').Router()
const { body, validationResult } = require("express-validator");


Router.post('/create-post',VerifyUser,[
body('caption').isLength(5),
body('user_id').isLength(6),
body('image').isURL()

],async(req,res)=>{
    const Result = validationResult(req);
    if (!Result.isEmpty()) {
      res.status(400).send({ message: Result.errors[0] });
    }
    let {caption ,image,user_id,name} = req.body;
    try {
        const AddPost = await Posts.create({
            name:name,caption:caption,user_id:user_id,image:image
        })
        await AddPost.save()
        if(AddPost){
            res.status(200).send({success:true,message:'Post added successfully',code:200})
        }
        console.log(AddPost)
    } catch (error) {
        console.log(error)
    }
})
Router.get('/allposts',VerifyUser,async(req,res)=>{
    try {
        const Getposts = await Posts.find({})
        if(!Getposts){
            res.status(400).send({message:"Posts not found",success:false,code:400})
        }
        res.send({data:Getposts,success:true,code:200}).status(2000)
    } catch (error) {
        console.log(error)
    }
})
Router.delete('/posts',VerifyUser,async(req,res)=>{
    let {id} = req.query;
    console.log(id)
    try {
        let findPost = await Posts.findOne({_id:id})
        console.log(findPost)
        if(!findPost){
            res.status(400).send({message:"Post not found.",success:false,code:400})

        }
        let deletePost = await Posts.deleteOne({_id:id})
        if(deletePost){
            res.status(200).send({success:true,message:"Post deleted successfully.",code:200})
        }
    } catch (error) {
console.log(error)
        
    }
})

module.exports =Router;