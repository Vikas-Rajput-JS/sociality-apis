const VerifyUser = require("../MiddleWare/Auth");
const Router = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require * "../Model/User.js";
const Stories = require("../Model/Stories");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
// const ApiVideoClient = require('@api.video/nodejs-client');
// const API_VIDEO_KEY = 'QM3WPsTsTzdRC8bZPKVOYMWAbSukMXqyJlivqdqYYwE'

Router.post("/story", VerifyUser, async (req, res) => {
      let { title, image } = req.body;
    let token = req.header("Auth");

    const decoded = jwt.verify(token, SECRET_KEY);
    var userId = decoded?.FindUser?.id;
    try {

    if (!userId) {
      res
        .status(400)
        .send({ success: false, message: "User Not Found", code: 400 });
    }
    let FindPost = await Stories.findOne({addedBy:userId})
    if (FindPost) {
        res
          .status(400)
          .send({ success: false, message: "You can post after 24 hours", code: 400 });
      }
    let createStory = await Stories.create({
        addedBy:userId,
        image:image,
        title:title
    });
    await createStory.save();
    if (createStory) {
      res
        .status(200)
        .send({
          success: true,
          message: "Story added successfully",
          code: 200,
        });
    }

    // res.send({ok:'dfgdfg'})
    // console.log(req.body,"454546")
    // const client = new ApiVideoClient({ apiKey: API_VIDEO_KEY });
    // const videoCreationPayload = {
    //     title: "Maths video", // The title of your new video.
    //     description: "A video about string theory.", // A brief description of your video.
    // };

    // const CreateVideo = await client.videos.upload('vi4k0jvEUuaTdRAEjQ4Jfrgz',);
    // console.log(CreateVideo,'=======================')
    // await client.videos.upload(CreateVideo.videoId, "my-video-file.mp4");
  } catch (error) {
console.log(error)
  }
});




Router.get('/stories',VerifyUser,async(req,res)=>{
    try {
        let Find = await Stories.find({}).populate("addedBy").select('-password')
        res.status(200).send({success:true,data:Find,status:200})
    } catch (error) {
        res
        .status(400)
        .send({ success: false, message: "something went wrong", status: 400 });
    }
})
module.exports = Router;
