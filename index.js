const Razorpay = require('razorpay')
const app = require('express')()
var crypto = require("crypto");
const port = 3001
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('request');

const key = process.env.key
const secret = process.env.secret  
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(bodyParser.json())
var instance = new Razorpay({
  key_id: key,
  key_secret: secret
})

app.get('/', (req,res) => {
  res.send('Welcome to razorpay subscription')
})
app.get('/get/plans', (req, res) => {
  var options = {
    url: 'https://api.razorpay.com/v1/plans',
    auth: {
      'user': key,
      'pass': secret
    }
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return res.json(body);
    }
    return res;
  }
  request(options, callback);
  return res
})
app.post('/create/plan', (req,res) => {
  console.log(req.body)
  var dataString = JSON.stringify(req.body) 
  var options = {
    url: 'https://api.razorpay.com/v1/plans',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: dataString,
    auth: {
      'user': key,
      'pass': secret
    }
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return res.json(body)
    }
    return res.json(body)
  }
  request(options, callback);
})
app.post('/create/subscription', (req,res) => {
  console.log(req.body)
  var dataString = JSON.stringify(req.body) 
  var options = {
    url: 'https://api.razorpay.com/v1/subscriptions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: dataString,
    auth: {
      'user': key,
      'pass': secret
    }
  };
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return res.json(body)
    }
    return res.json(body)
  }
  request(options, callback);
})
app.post("/api/payment/verify",(req,res)=>{
  console.log(req.body)
  let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var expectedSignature = crypto.createHmac('sha256', 'KiijS8JpwtaSIl8twXZl9Hyk')
  .update(body.toString())
  .digest('hex');
  console.log("sig received " ,req.body.razorpay_signature);
  console.log("sig generated " ,expectedSignature);
  var response = {"signatureIsValid":"false"}
  if(expectedSignature === req.body.razorpay_signature){ 
    response={"signatureIsValid":"true"}
  }
  return res.json(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})