const mongoose = require('mongoose')
const PaymentSchema = mongoose.Schema({
    user_id: {type:mongoose.Schema.Types.ObjectId,required:true,refs:'users'},
    paid_to: {type:Object,required:true,
    },
    transaction_type: {type:String,default:"subcription"},
    transaction_id:{type:String,required:true,unique:true},
    stripe_charge_id: {type:String},
    currency: {type:String,default:'usd'},
    amount: {type:Number,required:true},
    transaction_status: {type:String,required:true},
    subscription_plan_id: {type:mongoose.Schema.Types.ObjectId,refs:'plans'},
    payment_method: {type:String,required:true},
})

const Model = mongoose.model('payments',PaymentSchema)


module.exports = Model;