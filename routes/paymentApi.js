/**
 * TransactionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const db = sails.getDatastore().manager;
const constants = require('../../config/constants').constants;
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const credentials = require('../../config/local');
const Services = require('../services/index');
const excel = require('exceljs');
// const pdf = require('pdf-creator-node');
const pdf = require('html-pdf-phantomjs-included');
const fs = require('fs');
// const phantom = require('phantom-html-to-pdf');
const response = require('../services/Response');
var payment_const = require('../../config/local');
const stripe = require('stripe')(payment_const.PAYMENT_INFO.SECREATKEY);
const Emails = require('../Emails/index');

exports.addPayment = async (req, res) => {
    try {
        let { card_id, amount, currency, user_id, plan_id } = req.body;

        let find_user = await Users.findOne({ id: user_id, isDeleted: false, status: "active" });
        if (!find_user) {
            throw constants.TRANSACTION.INVALID_USER
        }

        let find_admin = await Users.findOne({ role: "admin", isDeleted: false, status: "active" });

        let plan_payload = {
            card_id: card_id,
            amount: amount,
            currency: currency,
            fullName: find_user.fullName,
            customer: find_user.customer_id
        }

        const createCharge = await stripe.charges.create({
            amount: Number(amount) * 100,
            currency: currency ? currency : 'USD',
            source: card_id,
            customer: find_user.customer_id,
            description: `This is ${find_user.fullName} details`,
        });
        if (createCharge) {
            let transaction_payload = {
                user_id: user_id,
                paid_to: find_admin.id ? find_admin.id : null,
                transaction_type: "buy_subscription",
                transaction_id: createCharge.id,
                stripe_charge_id: createCharge.id,
                currency: currency ? currency : "usd",
                amount: createCharge.amount ? createCharge.amount / 100 : 0,
                transaction_status: createCharge.status,
                subscription_plan_id: plan_id,
                payment_method: "card",
            }

            let create_transaction = await Transactions.create(transaction_payload).fetch();

            const is_plan_status = { is_plan: true, }
            const updatedUser = await Users.updateOne({ id: user_id }, is_plan_status)

            const plan = await Plans.findOne({id:plan_id,"isDeleted":false});

            await Emails.OnboardingEmails.payment_success({
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                plan: plan.name,
                amount: plan.price,
                //date : appointment_data.date,
                //description: appointment_data.description,
            });

            return res.status(200).json({
                success: true,
                message: constants.TRANSACTION.PAYMENT_SUCCESS,
                transaction_id: create_transaction.id,
                data: createCharge,
              });

        }
    } catch (error) {
        console.log(error, "--err");
        return response.failed(null, `${error}`, req, res)
    }
}

exports.getAllTransactions = async (req, res) => {
    try {
        let query = {};
        let count = req.param('count') || 10;
        let page = req.param('page') || 1;
        let sortBy = req.param("sortBy")
        let { subscription_plan_id, isDeleted, transaction_type, paid_to, user_id, search, role, export_to_xls,payment_method} = req.query;

        if (search) {
            query.$or = [
                { subscription_plan_name: { $regex: search, '$options': 'i' } },
                { user_id_name: { $regex: search, '$options': 'i' } },
                { paid_to_name: { $regex: search, '$options': 'i' } },
                { transaction_id: { $regex: search, '$options': 'i' } }

            ]
        }
        let skipNo = (page - 1) * count;

        if (user_id) {
            query.user_id = ObjectId(user_id)
        }

        if (paid_to) {
            query.paid_to = ObjectId(paid_to)
        }

        if (subscription_plan_id) {
            query.subscription_plan_id = ObjectId(subscription_plan_id)
        }

        if (transaction_type) {
            query.transaction_type = transaction_type
        }

        if (role) {
            query.role = role
        }

        if (payment_method) {
            query.payment_method = payment_method
        }

        let sortquery = {};
        if (sortBy) {
            let typeArr = [];
            typeArr = sortBy.split(" ");
            let sortType = typeArr[1];
            let field = typeArr[0];
            sortquery[field ? field : 'createdAt'] = sortType ? (sortType == 'desc' ? -1 : 1) : -1;
        } else {
            sortquery = { updatedAt: -1 }
        }

        if (isDeleted) {
            if (isDeleted === 'true') {
                isDeleted = true;
            } else {
                isDeleted = false;
            }
            query.isDeleted = isDeleted;
        } else {
            query.isDeleted = false;
        }

        db.collection('transactions').aggregate([
            {
                $lookup: {
                    from: "plans",
                    localField: "subscription_plan_id",
                    foreignField: "_id",
                    as: "subscription_plans_details"
                }
            },
            {
                $unwind: {
                    path: '$subscription_plans_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_id_details"
                }
            },
            {
                $unwind: {
                    path: '$user_id_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "paid_to",
                    foreignField: "_id",
                    as: "paid_to_details"
                }
            },
            {
                $unwind: {
                    path: '$paid_to_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    id: "$_id",
                    transactions_number: "$transactions_number",
                    user_id: "$user_id",
                    role: "$user_id_details.role",
                    paid_to: "$paid_to",
                    transaction_type: "$transaction_type",
                    subscription_plan_id: "$subscription_plan_id",
                    subscription_id: "$subscription_plan_id",
                    transaction_id: "$transaction_id",
                    stripe_charge_id: "$stripe_charge_id",
                    currency: "$currency",
                    amount: "$amount",
                    stripe_subscription_id: "$stripe_subscription_id",
                    transaction_status: "$transaction_status",
                    payment_method: "$payment_method",
                    addedBy: "$addedBy",
                    updatedBy: "$updatedBy",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    subscription_plan_name: "$subscription_plans_details.name",
                    user_id_name: "$user_id_details.fullName",
                    paid_to_name: "$paid_to_details.fullName",
                    isDeleted: {
                        $cond: [{ $ifNull: ['$trash_details', false] }, "$trash_details.isDeleted", false]
                    },
                    user_id_details: "$user_id_details",
                    subscription_plans_details: "$subscription_plans_details",
                }
            },
            {
                $match: query
            },
            {
                $sort: sortquery
            },
        ]).toArray((err, totalresult) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: { message: err },
                });
            }
            db.collection('transactions').aggregate([
                {
                    $lookup: {
                        from: "plans",
                        localField: "subscription_plan_id",
                        foreignField: "_id",
                        as: "subscription_plans_details"
                    }
                },
                {
                    $unwind: {
                        path: '$subscription_plans_details',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user_id_details"
                    }
                },
                {
                    $unwind: {
                        path: '$user_id_details',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "paid_to",
                        foreignField: "_id",
                        as: "paid_to_details"
                    }
                },
                {
                    $unwind: {
                        path: '$paid_to_details',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        id: "$_id",
                        transactions_number: "$transactions_number",
                        user_id: "$user_id",
                        role: "$user_id_details.role",
                        paid_to: "$paid_to",
                        transaction_type: "$transaction_type",
                        subscription_plan_id: "$subscription_plan_id",
                        subscription_id: "$subscription_plan_id",
                        transaction_id: "$transaction_id",
                        stripe_charge_id: "$stripe_charge_id",
                        currency: "$currency",
                        amount: "$amount",
                        stripe_subscription_id: "$stripe_subscription_id",
                        transaction_status: "$transaction_status",
                        payment_method: "$payment_method",
                        addedBy: "$addedBy",
                        updatedBy: "$updatedBy",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt",
                        subscription_plan_name: "$subscription_plans_details.name",
                        user_id_name: "$user_id_details.fullName",
                        paid_to_name: "$paid_to_details.fullName",
                        isDeleted: {
                            $cond: [{ $ifNull: ['$trash_details', false] }, "$trash_details.isDeleted", false]
                        },
                        user_id_details: "$user_id_details",
                        subscription_plans_details: "$subscription_plans_details",
                    },
                },
                {
                    $match: query
                },
                {
                    $sort: sortquery
                },
                {
                    $skip: Number(skipNo)
                },
                {
                    $limit: Number(count)
                }

            ]).toArray(async (err, result) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: { message: err },
                    });
                }

                if (export_to_xls == "yes") {
                    if (totalresult && totalresult.length > 0) {
                        let workbook = new excel.Workbook();
                        let worksheet = workbook.addWorksheet("Transactions");
                        worksheet.columns = [
                            { header: "S.No", key: "serial_number", width: 10 },
                            { header: "Client Name", key: "user_id_name", width: 30 },
                            { header: "Subscription Plan", key: "subscription_plan_name", width: 20 },
                            { header: "Amount", key: "amount", width: 10 },
                            { header: "Transaction ID", key: "transaction_id", width: 30 },
                            { header: "Transaction Status", key: "transaction_status", width: 20 },
                            { header: "Created At", key: "createdAt", width: 15 },
                        ];
                        let counter = 0;
                        for await (let values of totalresult) {
                            id = counter;
                            if (counter) {
                                values.serial_number = `${1 + counter}`;
                            } else {
                                values.serial_number = `${1}`;
                            }

                            if (values.amount) {
                                values.amount = `$${values.amount}`;
                            }

                            if (values.createdAt) {
                                values.createdAt = moment(values.createdAt).format('DD/MM/YYYY');
                            }
                            worksheet.addRow(values);
                            counter++;
                        }

                        try {
                            res.setHeader(
                                "Content-Type",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            );
                            res.setHeader(
                                "Content-Disposition",
                                "attachment; filename=" + "transactions.xlsx"
                            );


                            return workbook.xlsx.write(res).then(function () {
                                res.status(200).end();
                            });

                        } catch (err) {
                            return res.status(400).json({
                                success: false,
                                error: { message: err },
                            });
                        }

                    } else {
                        return res.status(200).json({
                            success: true,
                            message: `No data found to export`
                        });
                    }
                } else {

                    let resData = {
                        "success": true,
                        "message": constants.TRANSACTION.FETCHED_ALL,
                        "total": totalresult.length,
                        "data": result,
                    }
                    if (!req.param('count') && !req.param('page')) {
                        resData.data = totalresult ? totalresult : []
                    }
                    return res.status(200).json(resData);
                }

            })
        })

    } catch (err) {
        console.log(err, "err");
        return res.status(400).json({
            success: false,
            error: { message: err },
        });
    }
}

exports.downloadInvoice = async (req, res) => {
    try {
        var id = req.param("id");
        if (!id) {
            throw constants.TRANSACTION.ID_REQUIRED;
        }

        let get_transactions = await Transactions.findOne({ id: id });
        // console.log(get_transactions, "--------transaction");
        if (get_transactions) {
            let date = moment(get_transactions.createdAt).format('DD/MM/YYYY');
            let user_detail = await Users.findOne({ id: get_transactions.user_id });
            // console.log(user_detail, "----userdetails");
            let get_subscriptions = await Plans.findOne({ id: get_transactions.subscription_plan_id })

            let options = {
                localUrlAccess: true,
                // orientation : "portrait",
                "header": {
                    "height": "10mm",
                },
                width: "210mm",
                height: "297mm",
                childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }

            }


            html = `
        <body style="font-family: Open Sans, sans-serif;">
            <div class="layout" style="margin: 0px auto;max-width: 680px; border-top: solid 10px #09486b; border-radius: 3px;">
                <div class="main"style="box-shadow: 0 6px 18px rgb(0 0 0 / 6%);padding: 0 40px;padding-bottom:1rem;">
                    <div style="display: -webkit-box; display: flex; -webkit-box-pack: center; margin-top: 15px;">

                    <img style="max-width: 100px;" src="${credentials.ADMIN_WEB_URL}/images/logo.png">

                    </div>

                    <h1 style="font-size: 16px;margin-top:1rem;color: #09486b;">Invoice Detail</h1>
                    <table style=" border-collapse: collapse; width: 100%;">
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">Invoice</td>
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">#${get_transactions.transactions_number ? get_transactions.transactions_number : ""}</td>
                        </tr>
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="color:#444647 !important;  background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">Invoice Date</td>
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">${date ? date : ""}</td>
                        </tr>
                    </table>
                    <h1 style="font-size: 16px;margin-top:1rem;color: #09486b;">Organisation Detail</h1>
                    <table style=" border-collapse: collapse; width: 100%;">
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;"> Name</td>
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">${user_detail.fullName ? await Services.Utils.title_case(user_detail.fullName) : ""}</td>
                        </tr>
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="color:#444647 !important;  background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">Email</td>
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">${user_detail.email ? user_detail.email : ""}</td>
                        </tr>

                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="color:#444647 !important;  background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">Address</td>
                            <td style="color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">${user_detail ? await Services.Utils.title_case(user_detail.address) : ""}</td>
                        </tr>
                    </table>
                    <table style=" border-collapse: collapse; margin-top:1rem; width: 100%;">
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="font-weight: 600;width: 25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">Plan Name</td>
                            <td style="font-weight: 600;width:30% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">Amount</td>
                            <td style="font-weight: 600;width:25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;"> Total Amount</td>
                        </tr>
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="width: 25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;">${get_subscriptions.name ? await Services.Utils.title_case(get_subscriptions.name) : ""}</td>
                            <td style="width:30% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">$${get_transactions ? get_transactions.amount : 0}</td>
                            <td style="width:25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">$${get_transactions.amount ? get_transactions.amount.toFixed(2) : 0}</td>
                        </tr>
                       <!--- <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="height: 14px;width: 25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;"> </td>
                            <td style="height: 14px;width:30% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;"></td>
                            <td style="height: 14px;width:25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;"></td>
                        </tr> ---!>
                        <tr style="border: 1px solid rgba(237, 237, 237, 1);" >
                            <td style="font-weight: 600;width: 25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64); padding: 8px; width:25%;font-size: 12px;"> Grand Amount</td>
                            <td style="font-weight: 600;width:30% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;"></td>
                            <td style="font-weight: 600;width:25% !important; color:#444647 !important; background:#f5f1f1;; border: 1px solid rgba(237, 237, 237, 1);color: rgba(0, 0, 0, 0.64);padding: 8px;  width: 75%;font-size: 12px;">$${get_transactions ? get_transactions.amount.toFixed(2) : 0}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>        `
            pdf.create(html, options).toBuffer(function (err, buffer) {
                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=Invoice.pdf`);
                res.set('Content-Length', buffer.length);
                res.send(buffer);
            });
        } else {
            throw constants.TRANSACTION.INVALID_ID;
        }
    } catch (error) {
        console.log(error, '==========error')
        return res.status(400).json({
            success: false,
            error: { code: 400, message: '' + error },
        });
    }

}

exports.getTransactionById = async (req, res) => {
    try {
        let { id } = req.query;
        if (!id) {
            throw constants.TRANSACTION.ID_REQUIRED;
        }

        let get_transaction = await Transactions.findOne({ id: id }).populate('subscription_plan_id').populate('paid_to').populate('user_id');
        if (get_transaction) {
            return res.status(200).json({
                success: true,
                message: constants.TRANSACTION.FETCHED_ALL,
                data: get_transaction
            });
        }
        throw constants.TRANSACTION.INVALID_ID;
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: { code: 400, message: '' + error },
        });
    }
}

