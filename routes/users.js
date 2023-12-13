var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getuser',(req,res)=>{
  res.send({name:"vikas",email:"vikas@yopmail.com",city:'hisar'})
})

module.exports = router;
