const Router = require("express").Router();
const VerifyUser = require("../MiddleWare/Auth");
const Plans = require("../Model/SubcriptionPlans");
const { body, validationResult } = require("express-validator");
const User = require("../Model/User");
const Stripe = require("stripe");
const SECRET_KEY = "8678295@Vikas.Nikk$70561";
const requestPromise = require("request-promise")
;const jwt = require('jsonwebtoken')
const Transactions = require('../Model/Transactions')
const stripe = new Stripe(
  "sk_test_51OSDFOSJXboQazN3q61A2OoN8LwK4MEnOj23goQPUYRqOczFSJtqwQDuSGxCsctOypjQ09Qd0tKKE3USGDnnrrZp009TNkOSks"
);
Router.post("/plans", async (req, res) => {
  try {
    let { name, price } = req.body;
    let findPlan = await Plans.findOne({ name });

    if (findPlan) {
      res
        .status(400)
        .send({ message: "Plan already exists", code: 400, success: false });
    }
    let createPlan = await Plans.create({ name: name, price: price });
    if (!createPlan) {
      res
        .status(400)
        .send({ message: "Something Went wrong", success: false, code: 400 });
    }
    res
      .status(200)
      .send({ code: 200, success: true, message: "Plan added successfuly !" });
  } catch (error) {
    
    console.log(error);
  }
});

Router.get("/plans", VerifyUser, async (req, res) => {
  try {
    let GetPlans = await Plans.find({}).sort({price:1});

    if (!GetPlans) {
      res
        .status(404)
        .send({ success: false, code: 404, message: "Plans not found" });
    }

    res.status(200).send({
      success: true,
      data: GetPlans,
      message: "Plans fetched successfuly !",
      code: 200,
    });
  } catch (error) {
    console.log(error);
  }
});

// <<<<<<====================Google Pay Payment Intent Create=====================>>>>>>>>>>>>

Router.post(
  "/create-payment",
  VerifyUser,
  [body("googlePayToken").isLength(5), body("plan_id").isLength(5)],
  async (req, res) => {
    let Error = validationResult(req);
    if (!Error.isEmpty()) {
      return res
        .status(400)
        .send({ message: Error, code: 400, success: false });
    }
    try {
        let { plan_id, googlePayToken } = req.body;
      const token = req.header("Auth");
      const decoded = jwt.verify(token, SECRET_KEY);
      var userId = decoded?.FindUser?.id;
      let FindUser = await User.findById(userId);
      let FindPlan = await Plans.findById(plan_id);

      if (!FindUser) {
        return res
          .status(400)
          .send({ success: false, message: "User Not Found", code: 400 });
      }
      console.log(FindUser,'Plan Found')

      if (!FindPlan) {
        return res
          .status(400)
          .send({ success: false, message: "Plan Not Found", code: 400 });
      }
console.log(FindPlan,'Plan Found')
      let CreateIntent = await stripe.paymentIntents.create({
    payment_method_types:["card"],
    capture_method:'automatic',
        amount: FindPlan?.price,
        currency: "inr",
      description:'Software development services',
        payment_method_data: {
          type: "card",
          card: {
            token: googlePayToken,
          },
        
        },
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        confirmation_method: 'manual',
        confirm: true,
        // return_url: "https://codedera-officials.pages.dev",
      });

      console.log(CreateIntent)
    
      // const ConfirmIntent = await stripe.paymentIntents.confirm(
      //   CreateIntent?.id,
      //   {
      //     payment_method: CreateIntent?.payment_method,
      //     return_url: "https://codedera-officials.pages.dev",
      //   }
      // );
      // console.log(ConfirmIntent,'12222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222')
        let paymentPaload = {
          user_id: userId,
          paid_to: {
            name: "Vikas Rajput",
            email: "vikas@yopmail.com",
            mobile: 9518159867,
          },
          transaction_type: "subcription",
          transaction_id: CreateIntent.id,
          stripe_charge_id: CreateIntent.last_charge,
          currency: CreateIntent?.currency,
          amount: CreateIntent?.amount,
          transaction_status: CreateIntent?.status,
          subscription_plan_id: plan_id,
          payment_method: "googlePay",
        };

        const CreatePayment = await Transactions.create(paymentPaload)
        if(CreatePayment){
            res.status(200).send({success:true,message:'Payment is Completed Successfuly !',code:200,data:CreatePayment,ConfirmedPayment:CreateIntent})
        }
    
        // res.status(200).send({success:true,message:"Do You want to confirm this Payment ?",code:200})
      
    } catch (error) {
        console.log(error)
    }
  }
);
const CLIENT_ID = 'Un5fyRkYRviP_TdOOLMB1w'
const SECREATKEY = 'YdTF9kvX23FmsGNqVTNvYuAeHlBgRWuK'
const payload = {
  iss: 'Un5fyRkYRviP_TdOOLMB1w', //your API KEY
  exp: new Date().getTime() + 5000,
}
const token = jwt.sign(payload,'PaP5v21ZSlupwuTzhh_-Yg')

Router.post('/zoom',async(req,res)=>{
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + 'vr384695@gmail.com' + "/meetings",
    body: {
      topic: "Zoom Meeting Using Node JS", //meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };
  requestPromise(options)
    .then(function (response) {
      console.log("response is: ", response);
      res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      // API call failed...
      console.log("API call failed, reason ", err);
    });
})

module.exports = Router;
