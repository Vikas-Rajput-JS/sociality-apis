const Router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const VerifyUser = require("../MiddleWare/Auth");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
const nodemailer = require("nodemailer");
const OtpModel = require("../Model/Otp");
const Admin = require('../Model/Admin')
Router.post('/login',[
    body('email').isEmail(),
    body('password').isLength(8)
],async(req,res)=>{
    const Result = validationResult(req.body)
    if(!Result.isEmpty()){
        res.status(400).send({message:error.errors[0],success:false,code:400})
    }
try {
    let {email,password} = req.body;
    let all = await Admin.find({})
    console.log(all)
    const Salt = await bcrypt.genSalt(10);
    const GenPass = await bcrypt.hash(password, Salt);
    console.log(GenPass,'=============')
    let findAdmin = await Admin.findOne({email})
    if(!findAdmin){
        res.status(400).send({message:"Email Does not exists",success:false,code:400})
    }
    
  
    let Compare = await bcrypt.compare(password, findAdmin.password);
    if(!Compare){
        res.status(400).send({message:"Password is Incorrect",success:true,code:400})
    }
    const data = {
        findAdmin: {
          id: findAdmin.id,
        },
      };

      const token = jwt.sign(data, SECRET_KEY, { expiresIn: "5h" });
    res.status(200).send({message:"Logged in successfully",success:true,code:200,token:token})
} catch (error) {
    console.log(error)
}
})



Router.get("/profile", VerifyUser, async (req, res) => {
    const token = req.header("Auth");
    const decoded = jwt.verify(token, SECRET_KEY);
    var userId = decoded?.findAdmin?.id;
    console.log(userId, "================");
    try {
      const FindUser = await Admin.findById(userId).select("-password");
   
      if (!FindUser) {
        res
          .status(400)
          .send({ success: false, message: "User Not Found", code: 400 });
      }
      res.status(200).send({ success: true, code: 200, data: FindUser });
    } catch (error) {
      console.log(error);
    }
  });
module.exports = Router;