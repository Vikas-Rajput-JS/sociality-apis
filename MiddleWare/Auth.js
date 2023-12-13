const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = "8678295@Vikas.Nikk$70561";

const VerifyUser = (req, res, next) => {
    const token = req.header('Auth')
    if (!token) {
        res.status(400).send({ message: "Auth Token Required.", success: false })
    }
    try {
        const VerifyToken = jwt.verify(token, SECRET_KEY)
        req.user = VerifyToken.user
        next()
    } catch (error) {
        console.log(error)
        res.status(501).json({error:"Please Login Using Valid Auth Token"})
    }



}
module.exports = VerifyUser;