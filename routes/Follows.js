const VerifyUser = require('../MiddleWare/Auth');
const User = require('../Model/User')
const Router = require('./Posts')
const express = require('express').Router()
const jwt = require('jsonwebtoken')
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
Router.put('/follow',VerifyUser,async(req,res)=>{
    const token = req.header("Auth");
  const decoded = jwt.verify(token, SECRET_KEY);
  var userId = decoded?.FindUser?.id;
    try {
        
        let findUser = await User.findById(req.body.followId)
        console.log(findUser)
        if(!findUser){
            res.status(400).send({message:"User not found",success:false,code:400})
        }
        console.log(req.body.followId)
      const FindDuplicate = findUser?.followers.filter((itm)=>itm.toString()==req.body.followId.toString())
      console.log(FindDuplicate,"===================================")
      if(FindDuplicate.length>0){
        res.status(400).send({message:"You have already followed.",success:false,code:400})
      }
      if(FindDuplicate.length<1){

          let update = await User.findByIdAndUpdate(req.body.followId,{$push:{followers:userId},new:true})
          if(update){
              res.status(200).send({message:"You have follow successfull",success:true,code:200})
          }
        }
        // console.log(update)
    } catch (error) {
        console.log(error)
    }
})

// Router.get('/followers',async(req,res)=>{
//   let find = await User.find
// })
module.exports = Router