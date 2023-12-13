var express = require("express");
var router = express.Router();
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const VerifyUser = require("../MiddleWare/Auth");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "vr384695@gmail.com",
    pass: "pxbuudrsodvacyex",
  },
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
  
});
router.post(
  "/adduser",
  [
    body("name").isLength(4),
    body("email").isEmail(),
    body("password").isLength(8),
    body("city").isLength(3),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).send({ message: Result.errors[0] });
    }
    const { email, name, city, password } = req.body;
    let FindUser = await User.findOne({ email: email });
    console.log(FindUser);
    if (FindUser) {
      res.status(400).send({
        status: 400,
        message: "Email already exist with another user",
      });
    }
    try {
      if (!FindUser) {


        const Salt = await bcrypt.genSalt(10);
        const GenPass = await bcrypt.hash(password, Salt);
        const AddUser = await User.create({
          name: name,
          email: email,
          password: GenPass,
          city: city,
        });

        const SendMail = async () => {
          const info = await transporter.sendMail({
            from: 'vr384695@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Welcome to NodeTut", // Subject line
            text: "Thanks to Be a part of Developer's Zone", // plain text body
            html: "<b>Hello world?</b>", // html body
          });
        }

        if (AddUser) {
          SendMail()
          res
            .status(200)
            .send({ status: 200, message: "User added successfully" });

        }
      }
    } catch (error) {
      console.log({ err: error });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength(8)],
  async (req, res) => {
    let Result = validationResult(req)
    if (!Result.isEmpty()) {
      res.status(400).send({ message: Result.errors[0], success: false })
    }
    const { email, password } = req.body;
    try {
      console.log(req.body)
      let FindUser = await User.findOne({ email: email });
      if (!FindUser) {
        res
          .status(400)
          .send({ status: 400, message: "User not found", success: false });
      }
      console.log(FindUser)
      let Compare = await bcrypt.compare(password, FindUser.password);
      console.log(Compare, password)
      if (!Compare) {
        res
          .status(400)
          .send({
            message: "Password is incorrect",
            status: 400,
            success: false,
          });
      }

      const data = {

        FindUser: {
          id: FindUser.id
        }

      };
      const SendMail = async () => {
        const info = await transporter.sendMail({
          from: '"Developer"s Zone" vr384695@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Welcome to NodeTut", // Subject line
          text: "You have been logged in just a moment ago in Developer's Zone", // plain text body
          html: {}, // html body
        });
      }
      const token = jwt.sign(data, SECRET_KEY)

      res.status(200).send({ token: token })
      SendMail()

    } catch (error) {
      res.status(400).send({ message: error })
    }
  }
);




router.get('/getUser', VerifyUser, async (req, res) => {


  let count = parseInt(req.query.count) || 2;

  let page = parseInt(req.query.page) || 1;
  let search = req.query.search || '';
 let sortBy = req.query.sortBy

 let key = sortBy?.split(" ")[0]
console.log(key)
  const getusers = await User.find({ name: { $regex: search }, email: { $regex: search } }).limit(count).skip((page - 1) * count).sort({ name: -1 })

  res.send({ data: getusers, success: true, code: 200, total: getusers.length, page, page })
})




router.get("/welcome", async function (req, res, next) {
  res.render("index", { title: "Developer's Zone" });
  

});


module.exports = router;
