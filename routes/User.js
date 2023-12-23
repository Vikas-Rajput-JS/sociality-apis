var express = require("express");
var router = express.Router();
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const VerifyUser = require("../MiddleWare/Auth");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
const nodemailer = require("nodemailer");
const OtpModel = require("../Model/Otp");
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
router.get("/", async function (req, res) {
  res.render("index", { title: "Express" });
});
router.post(
  "/signup",
  [
    body("name").isLength(4),
    body("email").isEmail(),
    body("password").isLength(8),
    // body("city").isLength(3),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).send({ message: error.errors[0] });
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
          // city: city,
        });

        const SendMail = async () => {
          const info = await transporter.sendMail({
            from: "vr384695@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Welcome to NodeTut", // Subject line
            text: "Thanks to Be a part of Developer's Zone", // plain text body
            html: "<b>Hello world?</b>", // html body
          });
        };

        if (AddUser) {
          SendMail();
          res
            .status(200)
            .send({
              status: 200,
              message: "User added successfully",
              success: true,
            });
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
    let Result = validationResult(req);
    if (!Result.isEmpty()) {
      res
        .status(400)
        .json({
          message: Result?.errors[0].path=='password'?"Please enter valid password":Result?.errors[0].msg + " " + Result?.errors[0].path,
          success: false,
        });
    }
    const { email, password } = req.body;
    try {
      console.log(req.body);
      let FindUser = await User.findOne({ email: email });
      if (!FindUser) {
        res
          .status(400)
          .json({ status: 400, message: "User not found", success: false });
      }
      console.log(FindUser);
      let Compare = await bcrypt.compare(password, FindUser.password);

      if (!Compare) {
        res.status(401).send({
          message: "Password is incorrect",
          status: 401,
          success: false,
        });
        const SendMail = async () => {
          const info = await transporter.sendMail({
            from: '"Developer"s Zone" vr384695@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Login Alert !!", // Subject line
            text: "Someone tried to login in new device just a moment ago in Developer's Zone", // plain text body
            html: `<p>Is it you ? </p>
            `, // html body
          });
        };

        SendMail();
      } else {
        await transporter.sendMail({
          from: '"Developer"s Zone" vr384695@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Welcome to NodeTut", // Subject line
          text: "You have been logged in just a moment ago in Developer's Zone", // plain text body
          html: `<p>Welcome Back Dear ${email}</p>`, // html body
        });

        const data = {
          FindUser: {
            id: FindUser.id,
          },
        };

        const token = jwt.sign(data, SECRET_KEY, { expiresIn: "120" });

        res
          .status(200)
          .send({
            token: token,
            success: true,
            code: 200,
            message: "Login successfully",
          });
      }
    } catch (error) {
      console.log(error)
      // res.status(400).json({ message: error });  
    }
  }
);

router.get("/getUser", VerifyUser, async (req, res) => {
  let count = parseInt(req.query.count) || 2;

  let page = parseInt(req.query.page) || 1;
  let search = req.query.search || "";
  let sortBy = req.query.sortBy;

  let key = sortBy?.split(" ")[0];
  console.log(key);
  const getUsers = await User.find({});
  // const getusers = await User.find({
  //   name: { $regex: search },
  // })
  //   .limit(count)
  //   .skip((page - 1) * count)
  //   .set({
  //     createdAt: new Date(),
  //   }).exc('-password')
  // .sort({ name: 1 });

  res.send({
    data: getUsers,
    success: true,
    code: 200,
    total: getUsers.length,
    page,
    page,
  });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    let find = await User.findOne({ email });
    if (!find) {
      res
        .status(400)
        .send({ code: 400, message: "User not found", success: false });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    const AddOtp = await OtpModel.create({
      email: email,
      otp: otp,
    });

    const info = await transporter.sendMail({
      from: '"Developer"s Zone" vr384695@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Welcome to NodeTut", // Subject line
      text: "You may forgot your password in Developer's Zone", // plain text body
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your login</title>
          <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
          <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
              <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                  <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                      <tr>
                        <td style="padding: 40px 0px 0px;">
                          <div style="text-align: left;">
                            <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                          </div>
                          <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: left;">
                              <h1 style="margin: 1rem 0">Verification code</h1>
                              <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                              <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                              <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                              <p style="padding-bottom: 16px">Thanks,<br>The Mailmeteor team</p>
                            </div>
                          </div>
                          <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                            <p style="padding-bottom: 16px">Made with ♥ in Paris</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        
        </html>`, // html body
    });
    res
      .status(200)
      .send({ message: "Otp sent successfully", code: 200, success: true });
  } catch (error) {}
});

router.post("/verify-otp", async (req, res) => {
  let { email, otp } = req.body;
  let find = await User.findOne({ email });
  if (!find) {
    res
      .status(400)
      .send({ code: 400, success: false, message: "User not found" });
  }
  try {
    const GetOtp = await OtpModel.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (GetOtp?.length === 0 || otp != GetOtp?.otp) {
      return res
        .status(400)
        .send({ code: 400, message: "The OTP is not valid", success: false });
    }
    res
      .status(200)
      .send({
        code: 200,
        success: true,
        message: "OTP verified Successfully!",
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ code: 400, message: error, success: false });
  }
});

router.post("/reset-password", async (req, res) => {
  const { newPassword, email } = req.body;

  try {
    const FindUser = await User.findOne({ email: email });
    if (!FindUser) {
      res
        .status(400)
        .send({ code: 400, message: "User not found.", success: false });
    }

    const Salt = await bcrypt.genSalt(10);
    const GenPass = await bcrypt.hash(newPassword, Salt);
    const UpdatePassword = await User.updateOne(
      { email: email },
      { $set: { password: GenPass } }
    );
    if (UpdatePassword) {
      res
        .status(200)
        .send({
          code: 200,
          success: true,
          message: "Password reset successfully",
        });
    }
  } catch (error) {}
});

router.get("/profile", VerifyUser, async (req, res) => {
  const token = req.header("Auth");
  const decoded = jwt.verify(token, SECRET_KEY);
  var userId = decoded?.FindUser?.id;
  console.log(userId, "================");
  try {
    const FindUser = await User.findById(userId).select("-password");
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

router.put("/profile", VerifyUser, async (req, res) => {
  const token = req.header("Auth");
  const decoded = jwt.verify(token, SECRET_KEY);
  var userId = decoded?.FindUser?.id;
  console.log(userId, "================");
  try {
    const FindUser = await User.findById(userId);
    if (!FindUser) {
      res
        .status(400)
        .send({ success: false, message: "User Not Found", code: 400 });
    }
    const UpdateUser = await User.updateOne({_id:userId},{$set:req.body})
    if (UpdateUser) {
     
      res.status(200).send({ success: true, code: 200,message:"Profile updated successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/welcome", async function (req, res) {
  res.render("index", { title: "Developer's Zone" });
});

module.exports = router;
