var express = require("express");
var router = express.Router();
const User = require("../Model/User");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const VerifyUser = require("../MiddleWare/Auth");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
const nodemailer = require("nodemailer");
const ApiVideoClient = require('@api.video/nodejs-client');
const API_VIDEO_KEY = 'QM3WPsTsTzdRC8bZPKVOYMWAbSukMXqyJlivqdqYYwE'
const OtpModel = require("../Model/Otp");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "vr384695@gmail.com",
    pass: "rhebfxcwhnvaquye",
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
      res
        .status(400)
        .send({ message: error.errors[0], success: false, code: 400 });
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
            subject: "∞ Welcome to SociaLity ®", // Subject line
            text: "Thanks to Be a part of Developer's Zone", // plain text body
            html: `<!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            
            <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
              <style>
                * {
                  box-sizing: border-box;
                }
            
                body {
                  margin: 0;
                  padding: 0;
                }
            
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: inherit !important;
                }
            
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                }
            
                p {
                  line-height: inherit
                }
            
                .desktop_hide,
                .desktop_hide table {
                  mso-hide: all;
                  display: none;
                  max-height: 0px;
                  overflow: hidden;
                }
            
                .image_block img+div {
                  display: none;
                }
            
                @media (max-width:700px) {
            
                  .desktop_hide table.icons-inner,
                  .social_block.desktop_hide .social-table {
                    display: inline-block !important;
                  }
            
                  .icons-inner {
                    text-align: center;
                  }
            
                  .icons-inner td {
                    margin: 0 auto;
                  }
            
                  .image_block div.fullWidth {
                    max-width: 100% !important;
                  }
            
                  .mobile_hide {
                    display: none;
                  }
            
                  .row-content {
                    width: 100% !important;
                  }
            
                  .stack .column {
                    width: 100%;
                    display: block;
                  }
            
                  .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                  }
            
                  .desktop_hide,
                  .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                  }
            
                  .row-6 .column-1 .block-2.spacer_block,
                  .row-7 .column-1 .block-1.spacer_block,
                  .row-9 .column-1 .block-1.spacer_block {
                    height: 10px !important;
                  }
                }
              </style>
            </head>
            
            <body style="background-color: #171620; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
              <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171620;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/bg_lines.png'); background-repeat: no-repeat; background-size: cover;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                      <table class="icons_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; font-weight: 400; text-align: center;">
                                            <table class="alignment" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                              <tr>
                                                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><a href="www.example.com" target="_self" style="text-decoration: none;"><img class="icon" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/app_logo.png" alt="Company logo" height="64" width="45" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-3" style="height:45px;line-height:45px;font-size:1px;">&#8202;</div>
                                      <table class="image_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 510px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/overview_App.png" style="display: block; height: auto; border: 0; width: 100%;" width="510" alt="Overview of the app" title="Overview of the app"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="heading_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 56px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 84px;"><span class="tinyMce-placeholder">Welcome to <span style="color: #6c69ee;">SociaLity</span></span></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#ffffff;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Transform your finances with SociaLity. Budget, invest, prosper – all in one app.</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-7" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
                                      <table class="button_block block-8" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center"><!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:48px;width:172px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#6C69EE" fillcolor="#6c69ee">
            <w:anchorlock/>
            <v:textbox inset="0px,0px,0px,0px">
            <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
            <![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6c69ee;border-radius:4px;width:auto;border-top:1px solid #6C69EE;font-weight:400;border-right:1px solid #6C69EE;border-bottom:1px solid #6C69EE;border-left:1px solid #6C69EE;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Get Started!</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-9" style="height:70px;line-height:70px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h2 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">Your Social Snapshot</span></h2>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                            <div style="color:#acabaf;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Get a clear view of your Social journey with our profile viewing feature. Stay informed, stay in control.</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="button_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center"><!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:48px;width:174px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#6C69EE" fillcolor="#6c69ee">
            <w:anchorlock/>
            <v:textbox inset="0px,0px,0px,0px">
            <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
            <![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6c69ee;border-radius:4px;width:auto;border-top:1px solid #6C69EE;font-weight:400;border-right:1px solid #6C69EE;border-bottom:1px solid #6C69EE;border-left:1px solid #6C69EE;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">View Profile!</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="image_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;width:100%;">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 659.6px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/app_view.png" style="display: block; height: auto; border: 0; width: 100%;" width="659.6" alt="App view" title="App view"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">A Message From <span style="color: #6c69ee;">SociaLity</span>'s Admin</span></h2>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-3" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #2e2d36; border-radius: 18px; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 224.4px;"><img src="https://0cae0a2dbe.imgdist.com/pub/bfra/gr8ghccz/z5t/wls/hlu/XEGME5913.JPG" style="display: block; height: auto; border: 0; width: 100%;" width="224.4" alt="CEO of Company" title="CEO of Company"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; padding-top: 10px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Excited to have you join <span style="color: #6c69ee;">SociaLity</span>! We're here to make your financial journey a breeze. Let's achieve your goals together!</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                            <div style="color:#e5e5e5;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:20px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:24px;">
                                              <p style="margin: 0;">Vikas Rajput</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                            <div style="color:#e5e5e5;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:17px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:20.4px;">
                                              <p style="margin: 0;">CEO</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <div class="spacer_block block-2" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>About Us</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#171620;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
                                              <p style="margin: 0;">Nurturing Your Wealth, Growing Your Future</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>Links</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Webinar</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Knowledge base</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Profile</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Unsubscribe</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>Contact</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Info@company.com</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Help Center</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="social_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
                                            <div class="alignment" align="left">
                                              <table class="social-table" width="72px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                                <tr>
                                                  <td style="padding:0 4px 0 0;"><a href="https://www.example.com/VikasRajput8295" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png" width="32" height="32" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
                                                  <td style="padding:0 4px 0 0;"><a href="https://instagram.com/x4_vikas.env" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png" width="32" height="32" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
                                                </tr>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                              <tr>
                                                <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                  <!--[if !vml]><!-->
                                                  <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                    <tr>
                                                      <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                      <td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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
        };

        if (AddUser) {
          SendMail();
          res.status(200).send({
            status: 200,
            message: "You have sign up successfuly",
            success: true,
          });
        }
      }
    } catch (error) {
      console.log({ err: error });
    }
  }
);
// Add User For Admin
router.post(
  "/admin/user",
  [
    body("firstName").isLength(4),
    body("email").isEmail(),
    body("address").isLength(5),
    body("gender").isLength(2),

    // body("password").isLength(8),
    // body("city").isLength(3),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res
        .status(400)
        .send({ message: error.errors[0], success: false, code: 400 });
    }
    const { email, name, address, gender, lastName, firstName,image } = req.body;
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
        var chars =
          "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 12;
        var password = "";
        for (var i = 0; i <= passwordLength; i++) {
          var randomNumber = Math.floor(Math.random() * chars.length);
          password += chars.substring(randomNumber, randomNumber + 1);
        }
        const Salt = await bcrypt.genSalt(10);
        const GenPass = await bcrypt.hash(password, Salt);
        const AddUser = await User.create({
          firstName,
          lastName,
          email: email,
          address: address,
          gender: gender,
          password: GenPass,
          image:image
          // city: city,
        });

        const SendMail = async () => {
          const info = await transporter.sendMail({
            from: "vr384695@gmail.com", // sender address
            to: email, // list of receivers
            subject: "∞ Welcome to SociaLity ®", // Subject line
            text: "Thanks to Be a part of Developer's Zone", // plain text body
            html: `<!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            
            <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
              <style>
                * {
                  box-sizing: border-box;
                }
            
                body {
                  margin: 0;
                  padding: 0;
                }
            
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: inherit !important;
                }
            
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                }
            
                p {
                  line-height: inherit
                }
            
                .desktop_hide,
                .desktop_hide table {
                  mso-hide: all;
                  display: none;
                  max-height: 0px;
                  overflow: hidden;
                }
            
                .image_block img+div {
                  display: none;
                }
            
                @media (max-width:700px) {
            
                  .desktop_hide table.icons-inner,
                  .social_block.desktop_hide .social-table {
                    display: inline-block !important;
                  }
            
                  .icons-inner {
                    text-align: center;
                  }
            
                  .icons-inner td {
                    margin: 0 auto;
                  }
            
                  .image_block div.fullWidth {
                    max-width: 100% !important;
                  }
            
                  .mobile_hide {
                    display: none;
                  }
            
                  .row-content {
                    width: 100% !important;
                  }
            
                  .stack .column {
                    width: 100%;
                    display: block;
                  }
            
                  .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                  }
            
                  .desktop_hide,
                  .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                  }
            
                  .row-6 .column-1 .block-2.spacer_block,
                  .row-7 .column-1 .block-1.spacer_block,
                  .row-9 .column-1 .block-1.spacer_block {
                    height: 10px !important;
                  }
                }
              </style>
            </head>
            
            <body style="background-color: #171620; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
              <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171620;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/bg_lines.png'); background-repeat: no-repeat; background-size: cover;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
                                      <table class="icons_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; font-weight: 400; text-align: center;">
                                            <table class="alignment" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                              <tr>
                                                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px;"><a href="www.example.com" target="_self" style="text-decoration: none;"><img class="icon" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/app_logo.png" alt="Company logo" height="64" width="45" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-3" style="height:45px;line-height:45px;font-size:1px;">&#8202;</div>
                                      <table class="image_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 510px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/overview_App.png" style="display: block; height: auto; border: 0; width: 100%;" width="510" alt="Overview of the app" title="Overview of the app"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="heading_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 56px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 84px;"><span class="tinyMce-placeholder">Welcome to <span style="color: #6c69ee;">SociaLity</span></span></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#ffffff;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Transform your finances with SociaLity. Budget, invest, prosper – all in one app.</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-7" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
                                      <table class="button_block block-8" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center"><!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:48px;width:172px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#6C69EE" fillcolor="#6c69ee">
            <w:anchorlock/>
            <v:textbox inset="0px,0px,0px,0px">
            <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
            <![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6c69ee;border-radius:4px;width:auto;border-top:1px solid #6C69EE;font-weight:400;border-right:1px solid #6C69EE;border-bottom:1px solid #6C69EE;border-left:1px solid #6C69EE;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Get Started!</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-9" style="height:70px;line-height:70px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <h1>Password: ${GenPass}</h1>
                      <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h2 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">Your Social Snapshot</span></h2>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                            <div style="color:#acabaf;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Get a clear view of your Social journey with our profile viewing feature. Stay informed, stay in control.</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="button_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center"><!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:48px;width:174px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#6C69EE" fillcolor="#6c69ee">
            <w:anchorlock/>
            <v:textbox inset="0px,0px,0px,0px">
            <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
            <![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6c69ee;border-radius:4px;width:auto;border-top:1px solid #6C69EE;font-weight:400;border-right:1px solid #6C69EE;border-bottom:1px solid #6C69EE;border-left:1px solid #6C69EE;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">View Profile!</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="image_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;width:100%;">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 659.6px;"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8101/app_view.png" style="display: block; height: auto; border: 0; width: 100%;" width="659.6" alt="App view" title="App view"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <table class="heading_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;"><span class="tinyMce-placeholder">A Message From <span style="color: #6c69ee;">SociaLity</span>'s Admin</span></h2>
                                          </td>
                                        </tr>
                                      </table>
                                      <div class="spacer_block block-3" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #2e2d36; border-radius: 18px; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                            <div class="alignment" align="center" style="line-height:10px">
                                              <div class="fullWidth" style="max-width: 224.4px;"><img src="https://0cae0a2dbe.imgdist.com/pub/bfra/gr8ghccz/z5t/wls/hlu/XEGME5913.JPG" style="display: block; height: auto; border: 0; width: 100%;" width="224.4" alt="CEO of Company" title="CEO of Company"></div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-left: 10px; padding-right: 10px; padding-top: 10px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:36px;">
                                              <p style="margin: 0;">Excited to have you join <span style="color: #6c69ee;">SociaLity</span>! We're here to make your financial journey a breeze. Let's achieve your goals together!</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                            <div style="color:#e5e5e5;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:20px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:24px;">
                                              <p style="margin: 0;">Vikas Rajput</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
                                            <div style="color:#e5e5e5;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:17px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:20.4px;">
                                              <p style="margin: 0;">CEO</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                                      <div class="spacer_block block-2" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>About Us</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#171620;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
                                              <p style="margin: 0;">Nurturing Your Wealth, Growing Your Future</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>Links</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Webinar</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Knowledge base</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Profile</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Unsubscribe</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-left:20px;text-align:center;width:100%;">
                                            <h1 style="margin: 0; color: #171620; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 36px;"><strong>Contact</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Info@company.com</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 12px; font-family: Arial, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #171620; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #171620;" rel="noopener">Help Center</a></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="social_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;text-align:left;">
                                            <div class="alignment" align="left">
                                              <table class="social-table" width="72px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                                <tr>
                                                  <td style="padding:0 4px 0 0;"><a href="https://www.example.com/VikasRajput8295" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png" width="32" height="32" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
                                                  <td style="padding:0 4px 0 0;"><a href="https://instagram.com/x4_vikas.env" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png" width="32" height="32" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
                                                </tr>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <div class="spacer_block block-1" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                              <tr>
                                                <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                  <!--[if !vml]><!-->
                                                  <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                    <tr>
                                                      <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                      <td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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
        };

        if (AddUser) {
          SendMail();
          res.status(200).send({
            status: 200,
            message: "User added successfuly",
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
      res.status(400).json({
        message:
          Result?.errors[0].path == "password"
            ? "Please enter valid password"
            : Result?.errors[0].msg + " " + Result?.errors[0].path,
        success: false,
      });
    }
    const { email, password } = req.body;
    try {
      console.log(req.body);
      let FindUser = await User.findOne({ email: email });
      if (!FindUser) {
        res.status(400).json({
          status: 400,
          message: "Email does not exists in Our System!",
          success: false,
        });
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

        // SendMail();
      } else {
        // await transporter.sendMail({
        //   from: '"Developer"s Zone" vr384695@gmail.com', // sender address
        //   to: email, // list of receivers
        //   subject: "Welcome to NodeTut", // Subject line
        //   text: "You have been logged in just a moment ago in Developer's Zone", // plain text body
        //   html: `<p>Welcome Back Dear ${email}</p>`, // html body
        // });

        const data = {
          FindUser: {
            id: FindUser.id,
          },
        };

        const token = jwt.sign(data, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).send({
          token: token,
          success: true,
          code: 200,
          message: "Login successfully",
        });
      }
    } catch (error) {
      console.log(error);
      // res.status(400).json({ message: error });
    }
  }
);

router.get("/getUser", VerifyUser, async (req, res) => {
  let count = parseInt(req.query.count) || 2;
  console.log(req.headers.authorization);
  let page = parseInt(req.query.page) || 1;

  let sortBy = req.query.sortBy;
  let filter = req.query;
  let where = {};
  let SortObj = {};
  console.log(filter);
  const total = await User.countDocuments();
  console.log(total);
  if (filter.name) {
    where.name = { $regex: filter.name, $options: "i" };
  }
  if (filter.email) {
    where.email = { $regex: filter.email, $options: "i" };
  }
  if (filter.city) {
    where.city = { $regex: filter.city, $options: "i" };
  }
  let key = sortBy?.split(" ")[0];
  console.log(key);

  if (key) {
    SortObj[key] = parseInt(sortBy.split(" ")[1]);
  }
  const getUsers = await User.find(where)

    .limit(count)
    .skip((page - 1) * count)

    .sort(SortObj)
    .select("-password");

  res.send({
    data: getUsers,
    success: true,
    code: 200,
    total: total,
    page,
    page,
  });
});

router.get("/user/detail", async (req, res) => {
  try {
    let { id } = req.query;
    let FindUser = await User.findById(id).select('-password');
    if (!FindUser) {
      res
        .status(400)
        .send({ success: false, code: 400, message: "User not Found" });
    }
    res.status(200).send({ success: true, code: 200, data: FindUser });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, code: 400, message: "Something went wrong" });
  }
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
    res.status(200).send({
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
  const token = req.header("Auth");
  const decoded = jwt.verify(token, SECRET_KEY);
  var userId = decoded?.FindUser?.id;
  try {
    const FindUser = await User.findOne({ _id:userId });
    if (!FindUser) {
      res
        .status(400)
        .send({ code: 400, message: "User not found.", success: false });
    }

    const Salt = await bcrypt.genSalt(10);
    const GenPass = await bcrypt.hash(newPassword, Salt);
    const UpdatePassword = await User.updateOne(
      { _id: userId },
      { $set: { password: GenPass } }
    );
    if (UpdatePassword) {
      res.status(200).send({
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
    User.find({ _id: { $in: FindUser.followers } })
      .populate("followers")
      .select(["-password", "-followings"]) // Populate the 'followers' field (optional)
      .exec()
      .then((users) => {
        // Here, the 'users' array will contain the populated documents
        console.log(users, "==================users");
        res
          .status(200)
          .send({ data: FindUser, followers: users, success: true, code: 200 });
      });

   
    if (!FindUser) {
      res
        .status(400)
        .send({ success: false, message: "User Not Found", code: 400 });
    }
    // res.status(200).send({ success: true, code: 200, data: FindUser });
  } catch (error) {
    console.log(error);
  }
});

router.put('/admin/user',VerifyUser,async(req,res)=>{
  try {
    let { id } = req.body;
    let FindUser = await User.findById(id);
    if (!FindUser) {
      res
        .status(400)
        .send({ success: false, code: 400, message: "User not Found" });
    }

    let UpdateUser = await User.updateOne({
      _id:id
    },
    {
      $set:req.body
    })
    if (UpdateUser) {
      res.status(200).send({
        success: true,
        code: 200,
        message: "User updated successfully",
      });
    }

  } catch (error) {
    // res.send({ success: false, message: "User Not Found", code: 400 }).status(400);

  }
})

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
    const UpdateUser = await User.updateOne(
      { _id: userId },
      { $set: req.body }
    );
    if (UpdateUser) {
      res.status(200).send({
        success: true,
        code: 200,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});


router.delete('/user',VerifyUser,async(req,res)=>{
  try {
    const {id }  = req.query
    const FindUser = await User.findById(id);
    if (!FindUser) {
      res
        .status(400)
        .send({ success: false, message: "User Not Found", code: 400 });
    }

    let DeletUser = await User.deleteOne({_id:id})
    if(!DeletUser){
      res.send({ success: false, message: "Something went wrong", code: 400 });

    }
    res.status(200).send({
      success: true,
      code: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.send({ success: false, message: "Something went wrong", code: 400 });

  }
})
router.get("/welcome", async function (req, res) {
  res.render("index", { title: "Developer's Zone" });
});

module.exports = router;
